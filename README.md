# Crop-image

## Mentions
[![Start](https://img.shields.io/github/stars/Trandx/crop-image?style=flat-square)](https://github.com/Trandx/crop-image)
[![Total Downloads](https://img.shields.io/github/downloads/trandx/crop-image/total)](https://www.npmjs.com/package/@trandx/crop-image)
[![Known Vulnerabilities](https://snyk.io/test/github/Trandx/crop-image/badge.svg)](https://snyk.io/test/github/Trandx/crop-image/badge)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://opensource.org/)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

[![NPM Package](https://nodei.co/npm/@trandx/crop-image.png)](https://www.npmjs.com/package/@trandx/crop-image)

## Capture
[![crop image capture](https://github.com/Trandx/crop-image/blob/develop/public/capture.png)](https://github.com/Trandx/crop-image)

## Description
Crop-image is a simple package that will help you to capture a particular part of your image. this package is good if you want to manage certain part and resize a user profil.
This package is lite. it has zero-dependency and has wittren in TypeScript.

## Quick examples
```HTML
   <div id="app" class="flex justify-center space-x-1">
      <div class=" border-2 border-primary relative h-512 w-512"  >
        <img src="man-8293794_1280.webp" class="bg-gray-800 w-full h-full opacity-70" alt="" srcset="">
        <div id="cropElt" class=" border-primary absolute top-5 h-256 w-256  border-2" draggable="true">
            <canvas  class="rounded-full border-primary border-2" ></canvas>
            <!-- <div class="dot rotate" id="rotate"></div>
            <div class="rotate-link bg-[#1E88E5] hover:bg-[#0D47A1]"></div> -->
            <div class=" resizer top-left" ></div>
            <div class=" resizer bottom-left" ></div>
            <div class=" resizer  mid-top" ></div>
            <div class=" resizer mid-bottom" ></div>
            <div class=" resizer mid-left" ></div>
            <div class=" resizer mid-right" ></div>
            <div class=" resizer bottom-right" ></div>
            <div class=" resizer top-right" ></div>

            <div class=" w-full border-2 border-primary absolute border-dotted top-50"></div>
            <div class=" h-full border-2 border-primary absolute border-dotted top-0 left"></div>
        </div>
      </div>
      <div class="w-512 h-512 border-2 border-primary">
        <img src="man-8293794_1280.webp" srcset="" id="imgCropped" class="w-full h-full"/>
      </div>
    </div>
```

```javascript
  import { CropImage } from '@trandx/crop-image';
    
      const cropElt = document.querySelector('#cropElt')
      const imageSrc = "man-8293794_1280.webp"
      const imgCropped = document.querySelector("#imgCropped")
      const corner_class = {
        top_left: "top-left",
        mid_top: "mid-top",
        top_right: "top-right",
        mid_left: "mid-left",
        mid_right: "mid-right",
        bottom_left: "bottom-left",
        mid_bottom: "mid-bottom",
        bottom_right: "bottom-right",
      }

      const cropImage = new CropImage()
   
      cropImage.run({crop_elt: cropElt, img_src: imageSrc, corner_class})?.oncrop((e)=>{
        /**
          * to get data, you can use the const cropImage or event e 
          * 
          * eg 1 :
          * 
          * // const crop = e.currentTarget as CropImage
          * // console.log(crop.getImageCropped());
          * 
          * eg 2:
          * 
          * //cropImage.download();
          * //imageCropped.value.src = cropImage.getImageCropped()
          * 
          */
        const crop = e.currentTarget
        const data = crop.getImageCropped("webp")
        imgCropped.srcset = data
        console.log(data);
      })
    
```

```Csss
CHECK CSS CODE IN THE PACKAGE
```
## Running online code link 
For running code you can check [here](https://playcode.io/1725137)

NOTE: The default attribut Class that you see in this prevevious JS example can be updated but, it must be declared in the HTML Code for a well running

#### Running
Install via package manager

``npm i @trandx/crop-image``
  or
``pnpm i @trandx/crop-image``

To run benchmark on your PC follow steps from below

1) git clone ``https://github.com/Trandx/crop-image.git``
2) cd ``into the directory ``
3) pnpm install
4) pnpm dev

In case you notice any irregularities in benchmark or you want to add sort library to benchmark score
please open issue [here](https://github.com/Trandx/crop-image)
## Author

  [![alt text](https://avatars.githubusercontent.com/u/42522718?v=4)](https://github.com/Trandx/crop-image)
