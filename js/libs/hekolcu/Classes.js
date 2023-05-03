class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Brandimos {
  constructor(brandImage, relatedImages, position) {
    this.brandImage = brandImage;
    this.relatedImages = relatedImages;
    this.position = position;
  }
  
  getBrandImage() {
    return this.brandImage;
  }
  
  setBrandImage(brandImage) {
    this.brandImage = brandImage;
  }
  
  getRelatedImages() {
    return this.relatedImages;
  }
  
  setRelatedImages(relatedImages) {
    this.relatedImages = relatedImages;
  }
  
  getPosition() {
    return this.position;
  }
  
  setPosition(position) {
    this.position = position;
  }
}

