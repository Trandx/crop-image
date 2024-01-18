type CropImageType = {
    crop_elt: HTMLElement;
    img_src: string;
    crop_size?: SizeCropElementType;
    corner_class: cornerClassType;
  };
  type cornerClassType = {
    top_left: string | boolean;
    mid_top: string | boolean;
    top_right: string | boolean;
    mid_left: string | boolean;
    mid_right: string | boolean;
    bottom_left: string | boolean;
    mid_bottom: string | boolean;
    bottom_right: string | boolean;
  };
  
  type SizeCropElementType = {
    width: number;
    height?: number;
  };
  
  type SizeElementType = {
    width: number;
    height: number;
    left: number;
    top: number;
  };
  
  type DeltaType = {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
  };
  
  type DrawImageType = [
    image: CanvasImageSource,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ];
  
  type FormatType = "jpeg" | "png" | "webp";
  
  type MousePositionType = { x: number; y: number };
  
  
  export class CropImage extends EventTarget {
    constructor() {
      super();
      this.coppedEvent = new CustomEvent("cropped");
      this.img = new Image();
      this.img.crossOrigin = "*";
      this.mouse = { x: 0, y: 0 };
      this.original = { width: 0, height: 0, left: 0, top: 0 };
  
      this.eltHasClass = {
        top_left: false,
        mid_top: false,
        top_right: false,
        mid_left: false,
        mid_right: false,
        bottom_left: false,
        mid_bottom: false,
        bottom_right: false,
      };
    }
  
    private coppedEvent: CustomEvent;
    private cropElt!: HTMLElement;
    private canvas!: HTMLCanvasElement;
    private btnResizer!: NodeListOf<HTMLDivElement>;
    private baseElt!: HTMLElement;
    private img: HTMLImageElement;
  
    private cornerClass!: cornerClassType;
  
    private eltHasClass: cornerClassType;
  
    private mouse: MousePositionType;
  
    private deltaMouse!: MousePositionType;
  
    private original: SizeElementType;
  
    private buildImage = () => {
      this.img.crossOrigin = "*";
      this.img.onerror = function () {
        throw new Error("Could not load image");
      };
  
      this.img.onload = () => {
        //this.resize(); // resize if overflow
  
        this.drawImageInCanvas();
  
        this.cropElt.ondragstart = this.dragStart;
      };
    };
  
    private resetEltHasClass() {
      this.eltHasClass = {
        top_left: false,
        mid_top: false,
        top_right: false,
        mid_left: false,
        mid_right: false,
        bottom_left: false,
        mid_bottom: false,
        bottom_right: false,
      };
    }
  
    private checkCSS_Class(elt: HTMLElement) {
      this.resetEltHasClass();
  
      Object.entries(this.cornerClass).forEach(([key, className]) => {
        const hasClass = elt.classList.contains(className as string);
  
        if (hasClass) {
          this.eltHasClass[key as keyof typeof this.cornerClass] = true;
        }
      });
    }
  
    private resize() {
      this.btnResizer = this.cropElt.querySelectorAll(".resizer")
  
      this.btnResizer.forEach((currentResizer) => {
        currentResizer.addEventListener("mousedown", (evt) => {
          evt.preventDefault();
  
          this.mousePosition(evt);
  
          this.getElmentSize(currentResizer.parentElement);
  
          this.checkCSS_Class(currentResizer);
  
          window.onmousemove = (evt) => this.startResize(evt, currentResizer);
  
          window.onmouseup = () => this.stopResize(window);
        });
      });
    }
  
    private getElmentSize(elt: HTMLElement | null) {
      if (!elt) throw "undefined element";
  
      this.original.width = elt.offsetWidth;
      this.original.height = elt.offsetHeight;
      this.original.left = elt.offsetLeft;
      this.original.top = elt.offsetTop;
  
    }
  
    private resizeTo({
      elt,
      newPosition,
      delta,
    }: {
      elt: HTMLElement;
      newPosition: Partial<SizeElementType>;
      delta: DeltaType;
    }) {
      return {
        left: () => {
          const left = this.original.left + this.deltaMouse.x;
          if (delta.left && delta.left <= 0) {
            elt.style.left = 0 + "px";
          } else if (newPosition.width && newPosition.width > 50 && left > 0) {
            elt.style.width = newPosition.width + "px";
            elt.style.left = left + "px";
          }
        },
        right: () => {
          if (newPosition.left !== undefined && delta.right && delta.right <= 0) {
            elt.style.width = this.baseElt.offsetWidth - newPosition.left + "px";
          } else if (newPosition.width && newPosition.width > 50) {
            elt.style.width = newPosition.width + "px";
          }
        },
        top: () => {
          const top = this.original.top + this.deltaMouse.y;
  
          if (delta.top && delta.top <= 0) {
            elt.style.top = 0 + "px";
          } else if (newPosition.height && newPosition.height > 50 && top > 0) {
            elt.style.height = newPosition.height + "px";
            elt.style.top = top + "px";
          }
        },
        bottom: () => {
          if (
            delta.bottom &&
            newPosition.top !== undefined &&
            delta.bottom <= 0
          ) {
            elt.style.height = this.baseElt.offsetHeight - newPosition.top + "px";
          } else if (newPosition.height && newPosition.height > 50) {
            elt.style.height = newPosition.height + "px";
          }
        },
      };
    }
  
    private startResize = (evt: MouseEvent, elt: HTMLElement) => {
      const _parentNode = elt.parentElement;
  
      if (!_parentNode) {
        throw "not parent element";
      }
  
      // calculate the new cursor position:
      this.deltaMouse = {
        x: evt.clientX - this.mouse.x,
        y: evt.clientY - this.mouse.y,
      };
  
      if (this.eltHasClass.bottom_right) {
        const newPosition: SizeElementType = {
          top: _parentNode.offsetTop,
          left: _parentNode.offsetLeft,
          width: this.original.width + this.deltaMouse.x,
          height: this.original.height + this.deltaMouse.y,
        };
  
        const delta: DeltaType = {
          bottom:
            this.baseElt.offsetHeight - (newPosition.top + newPosition.height),
          right:
            this.baseElt.offsetWidth - (newPosition.left + newPosition.width),
        };
  
        const _resizeTo = this.resizeTo({
          elt: _parentNode,
          newPosition: newPosition,
          delta: delta,
        });
  
        _resizeTo.bottom();
        _resizeTo.right();
  
        this.canvasFullSize();
  
        return;
      }
  
      if (this.eltHasClass.bottom_left) {
        const newPosition = {
          top: _parentNode.offsetTop,
          left: _parentNode.offsetLeft,
          width: this.original.width - this.deltaMouse.x,
          height: this.original.height + this.deltaMouse.y,
        };
  
        const delta = {
          left: newPosition.left,
          bottom:
            this.baseElt.offsetHeight - (newPosition.top + newPosition.height),
        };
  
        const _resizeTo = this.resizeTo({
          elt: _parentNode,
          newPosition: newPosition,
          delta: delta,
        });
  
        _resizeTo.bottom();
        _resizeTo.left();
  
        this.canvasFullSize();
  
        return;
      }
  
      if (this.eltHasClass.top_left) {
        const newPosition = {
          top: _parentNode.offsetTop,
          left: _parentNode.offsetLeft,
          width: this.original.width - this.deltaMouse.x,
          height: this.original.height - this.deltaMouse.y,
        };
  
        const delta = {
          top: newPosition.top,
          left: newPosition.left,
        };
  
        const _resizeTo = this.resizeTo({
          elt: _parentNode,
          newPosition: newPosition,
          delta: delta,
        });
  
        _resizeTo.top();
        _resizeTo.left();
  
        this.canvasFullSize();
  
        return;
      }
  
      if (this.eltHasClass.top_right) {
        const newPosition = {
          top: _parentNode.offsetTop,
          left: _parentNode.offsetLeft,
          width: this.original.width + this.deltaMouse.x,
          height: this.original.height - this.deltaMouse.y,
        };
  
        const delta = {
          top: newPosition.top,
          right:
            this.baseElt.offsetWidth - (newPosition.left + newPosition.width),
        };
  
        const _resizeTo = this.resizeTo({
          elt: _parentNode,
          newPosition: newPosition,
          delta: delta,
        });
  
        _resizeTo.top();
        _resizeTo.right();
  
        this.canvasFullSize();
  
        return;
      }
  
      if (this.eltHasClass.mid_right) {
        const newPosition = {
          left: _parentNode.offsetLeft,
          width: this.original.width + this.deltaMouse.x,
        };
  
        const delta = {
          right:
            this.baseElt.offsetWidth - (newPosition.left + newPosition.width),
        };
  
        const _resizeTo = this.resizeTo({
          elt: _parentNode,
          newPosition: newPosition,
          delta: delta,
        });
  
        _resizeTo.right();
  
        this.canvasFullSize();
  
        return;
      }
  
      if (this.eltHasClass.mid_left) {
        const newPosition = {
          left: _parentNode.offsetLeft,
          width: this.original.width - this.deltaMouse.x,
        };
  
        const delta = {
          left: newPosition.left,
        };
  
        const _resizeTo = this.resizeTo({
          elt: _parentNode,
          newPosition: newPosition,
          delta: delta,
        });
  
        _resizeTo.left();
  
        this.canvasFullSize();
  
        return;
      }
  
      if (this.eltHasClass.mid_top) {
        const newPosition = {
          top: _parentNode.offsetTop,
          height: this.original.height - this.deltaMouse.y,
        };
  
        const delta = {
          top: newPosition.top,
        };
  
        const _resizeTo = this.resizeTo({
          elt: _parentNode,
          newPosition: newPosition,
          delta: delta,
        });
  
        _resizeTo.top();
  
        this.canvasFullSize();
  
        return;
      }
  
      if (this.eltHasClass.mid_bottom) {
        const newPosition = {
          top: _parentNode.offsetTop,
          height: this.original.height + this.deltaMouse.y,
        };
  
        const delta = {
          bottom:
            this.baseElt.offsetHeight - (newPosition.top + newPosition.height),
        };
  
        const _resizeTo = this.resizeTo({
          elt: _parentNode,
          newPosition: newPosition,
          delta: delta,
        });
  
        _resizeTo.bottom();
  
        this.canvasFullSize();
  
        return;
      }
    };
  
    private stopResize(elt: Window | Document) {
      elt.onmousemove = null;
  
      //console.log("focus out", elt);
    }
  
    private drawImageInCanvas() {
      const _canvas = this.canvas;
      const _cropElt = this.cropElt;
  
      if (!_canvas) {
        throw Error("canvas is undefined");
      }
      const _img: CanvasImageSource = this.img;
      const _baseElt = this.baseElt;
      const scale = {
        x: _baseElt.clientWidth / _img.width, // x scale of image inside the image tag
        y: _baseElt.clientHeight / _img.height, // y scale of image inside the image tag
      };
  
      //console.log("image",_img.height, _img.naturalHeight, _img.clientHeight, "scale", scale);
  
      const drawImageData: DrawImageType = [
        _img,
        _cropElt.offsetLeft / scale.x, // x-axis coordinate of the top left of first pixel
        _cropElt.offsetTop / scale.y, // y-axis coordinate of the top left of first pixel
        _cropElt.offsetWidth / scale.x, // width of image cropped
        _cropElt.offsetHeight / scale.y, //  height of image cropped
        0, // x-axis coordinate of the top left
        0, //y-axis coordinate of the top left
        _canvas.width, // width of canvas
        _canvas.height, // height of canvas
      ];
  
      //console.log( _canvas.clientWidth, _canvas.width, _canvas.offsetTop, scale);
  
      _canvas.getContext("2d")?.drawImage(...drawImageData);
    }
  
    private mousePosition(evt: MouseEvent) {
      // get the mouse cursor position
      this.mouse.x = evt.clientX;
      this.mouse.y = evt.clientY;
    }
  
    private dragStart = (evt: MouseEvent) => {
      evt.preventDefault();
  
      // get the mouse cursor position at startup:
      this.mousePosition(evt);
  
      // // call a function whenever the cursor moves:
      this.cropElt.onmousemove = this.dragElement;
  
      // stop moving when mouse button is released:
      this.cropElt.onmouseup = this.dragEnd;
    };
  
    private dragEnd = () => {
      // stop moving when mouse button is released:
  
      const _cropElt = this.cropElt;
      _cropElt.onmousemove = null;
      _cropElt.onmouseup = null;
      //this.getImageCropped()
  
      this.dispatchEvent(this.coppedEvent);
    };
  
    private dragElement = async (evt: MouseEvent) => {
      (async () => {
        const _mouse = this.mouse;
        const _cropElt = this.cropElt;
        const baseElt = this.baseElt;
  
        // calculate the new cursor position:
        const _deltaMouse = {
          x: evt.clientX - _mouse.x,
          y: evt.clientY - _mouse.y,
        };
  
        // set the element's new position:
        const newCropPosition = {
          top: _cropElt.offsetTop + _deltaMouse.y,
          left: _cropElt.offsetLeft + _deltaMouse.x,
          maxTop: baseElt.offsetHeight - _cropElt.offsetHeight,
          maxLeft: baseElt.offsetWidth - _cropElt.offsetWidth,
        };
  
        const deltaBottom =
          baseElt.offsetHeight - (newCropPosition.top + _cropElt.offsetHeight);
        const deltaRight =
          baseElt.offsetWidth - (newCropPosition.left + _cropElt.offsetWidth);
  
        _cropElt.style.top =
          (deltaBottom < 0
            ? newCropPosition.maxTop
            : newCropPosition.top < 0
            ? 0
            : newCropPosition.top
          ).toString() + "px";
  
        _cropElt.style.left =
          (deltaRight < 0
            ? newCropPosition.maxLeft
            : newCropPosition.left < 0
            ? 0
            : newCropPosition.left
          ).toString() + "px";
  
        //console.log({x: mouse.x, y: mouse.y}, deltaTop, deltaLeft, deltaBottom, deltaRight);
        
  
        this.mouse = {
          x: evt.clientX,
          y: evt.clientY,
        };
      })().then(() => this.drawImageInCanvas());
    };
  
    private canvasFullSize() {
      this.canvas.width = this.cropElt.clientWidth;
      this.canvas.height = this.cropElt.clientHeight;
  
      this.canvas.style.width = this.canvas.width + "px";
      this.canvas.style.height = this.canvas.height + "px";
    }
  
    /**
     * public function
     */
  
    /*, crop_size */
  
    public run({ crop_elt, img_src, corner_class }: CropImageType) {
      this.img.src = img_src;
      this.cropElt = crop_elt;
      this.cornerClass = corner_class;
  
      if (this.cropElt) {
        this.baseElt = <HTMLElement>this.cropElt.parentNode;
        this.canvas = <HTMLCanvasElement>this.cropElt.querySelector("canvas");
  
        this.canvasFullSize();
  
        this.resize();
  
        this.buildImage();
  
        return this;
      }
    }
  
    public oncrop(fn: EventListenerOrEventListenerObject | null) {
      //this.event = new CustomEvent("cropped", {detail: fn});
      this.addEventListener("cropped", fn); // handle copped event
    }
  
    public download = () => {
      //alert('testss')
      const canvasUrl = this.getImageCropped();
  
      const createEl = document.createElement("a");
      createEl.href = canvasUrl;
  
      // This is the name of our downloaded file
      createEl.download = "download-this-canvas";
  
      // Click the download button, causing a download, and then remove it
      createEl.click();
      createEl.remove();
    };
  
    public getImageCropped = (
      type: FormatType | null = "png",
      quality: number | null = 1
    ) => {
      //console.log(this.canvas.style.width = "120px", this.canvas.width=120);
  
      return this.canvas.toDataURL(`image/${type}`, quality);
    };
  }
  
  export interface ICropImage {
    run({ crop_elt, img_src, corner_class }: CropImageType) : CropImage
    oncrop(fn: EventListenerOrEventListenerObject | null): void
    download(): void
    getImageCropped(): string
  }
  
  export default CropImage;
  