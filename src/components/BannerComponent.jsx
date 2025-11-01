import ImageComponent from './ImageComponent'

export default function BannerComponent() {
  return (
    <>
      <h1>Holo!!!</h1>
      <ImageComponent 
        url="https://play-lh.googleusercontent.com/52py3YEUuxRdgmA5QHct3RaR5GHejI0mWiBuFY-BTdyMENWVtr77MArJFe-Gzd4spw"
        alt="Imagen de naturaleza"
        className="banner-image"
      />
    </>
  )
}

