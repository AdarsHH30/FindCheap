export default function Head() {
  return (
    <>
      <link rel="preload" href="/find-prod.png" as="image" />
      <link
        rel="preload"
        href="/demo.mp4"
        as="video"
        type="video/mp4"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/models/earbuds.glb"
        as="fetch"
        type="model/gltf-binary"
        crossOrigin="anonymous"
      />
    </>
  );
}
