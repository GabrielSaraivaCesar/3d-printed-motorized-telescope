import os
import cv2 as cv
import time
import numpy as np
import random

def sp_noise(image,prob):
    '''
    Add salt and pepper noise to image
    prob: Probability of the noise
    '''
    output = np.zeros(image.shape,np.uint8)
    thres = 1 - prob 
    for i in range(image.shape[0]):
        if i < 31: continue
        for j in range(image.shape[1]):
            if j < 31: continue

            rdn = random.random()
            if rdn < prob:
                output[i][j] = image[i][j]
            elif rdn > thres:
                output[i:i+20, j:j+20] = cv.GaussianBlur(image[i:i+20, j:j+20], (5,5), cv.BORDER_DEFAULT)
            else:
                output[i][j] = image[i][j]
    return output

def find_object(original_image:cv.Mat):
    # Blurry to find contours better
    blurry = cv.GaussianBlur(original_image, (25, 35), cv.BORDER_DEFAULT)

    # Set image to gayscale  before using cv.threshhold
    gray_img = cv.cvtColor(blurry, cv.COLOR_BGR2GRAY)

    # Transform image into 0s and 250 based on the specified grayscale threshhold
    ret, threshhold = cv.threshold(gray_img, 10, 255, cv.THRESH_BINARY)

    # Find object contours
    contours, hierarchies = cv.findContours(threshhold, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE)
    print(len(contours))
    # Find contour bounding rect
    rect = cv.boundingRect(contours[0])
    cv.rectangle(original_image, (rect[0], rect[1]), (rect[2], rect[3]), (0,0,255), 2)
    return rect

def load_images():
    images_path = './test_images'
    images = [file for file in os.listdir('./test_images') if os.path.isfile(os.path.join(images_path, file))]
    parsed_images = []
    for image in images:
        parsed = cv.imread(os.path.join(images_path, image))
        h, w, _ = parsed.shape
        new_scale = 1080 / h
        w = int(w * new_scale)
        h = int(h * new_scale)
        parsed = cv.resize(parsed, (w,h))
        parsed = sp_noise(parsed, 0.3)
        parsed_images.append(parsed)

    return parsed_images

def stack_images(images:list[cv.Mat]):
    image_alpha=1/len(images)

    # Convert images to semitransparent bgra
    
    stacked = cv.addWeighted(images[0], 0, images[0], image_alpha, 0)
    target_position = find_object(images[0])

    for idx, image in enumerate(images):
        if idx == 0: continue
        tx,ty,tw,th = target_position
        x,y,w,h = find_object(image)
        if w < tw:
            w = tw
        elif tw < w:
            tw = w
        
        if h < th:
            h = th
        elif th < h:
            th = h
        
        stacked[ty:ty+th, tx:tx+tw] = cv.add(
            stacked[ty:ty+th, tx:tx+tw], 
            cv.addWeighted(image[y:y+h, x:x+w], 0, image[y:y+h, x:x+w], image_alpha, 0)
        )
    
    return stacked

# images = load_images()
# stacked_images = stack_images(images)

im = cv.imread("./sapo.jpeg")
# cv.imshow('sapo', im)
# Set image to gayscale  before using cv.threshhold
gray_img = cv.cvtColor(im, cv.COLOR_BGR2GRAY)
# Transform image into 0s and 250 based on the specified grayscale threshhold
ret, threshhold = cv.threshold(gray_img, 100, 255, cv.THRESH_BINARY)

# Find object contours
contours, hierarchies = cv.findContours(threshhold, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE)
h, w, _ = im.shape

canny = cv.Canny(gray_img, 120, 150)
canny = cv.bitwise_not(canny)
im2 = np.ones((w, h, 3), dtype = np.uint8) *  255
cv.fillPoly(canny, contours, (0,0,0))
canny = cv.bitwise_not(canny)

cv.drawContours(im2, contours, -1, (0, 0, 0), 1)


cv.imshow('sapo 2', canny)
cv.imwrite('sapo2.jpeg', canny)
cv.waitKey(0)