<script>
    let currentImage = 0;
    export let images;
  
    function nextImage() {
      currentImage = (currentImage + 1) % images.length;
    }
  
    function prevImage() {
      currentImage = (currentImage - 1 + images.length) % images.length;
    }
  </script>
  
    
  <div class="carousel-container">
    <img src={images[currentImage]} alt="Carousel Image" class="carousel-image" />
  
    <div class="carousel-nav">
      <div class="carousel-button" on:click={prevImage}>Previous</div>
      <div class="carousel-button" on:click={nextImage}>Next</div>
    </div>
  </div>
  
  
  <style>
    .carousel-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 300px;
      overflow: hidden;
      position: relative;
    }
  
    .carousel-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
    }
  
    .carousel-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      gap: 10px;
    }
  
    .carousel-button {
      cursor: pointer;
      padding: 10px;
      background-color: rgba(255, 255, 255, 0.5);
      border: 1px solid #ccc;
      border-radius: 50%;
    }
  </style>
