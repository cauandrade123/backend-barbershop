const CORES_PLACEHOLDER = ["#c9a24b", "#5c2020", "#26201a", "#e4c877", "#8a6b2f", "#3a2a1a"];

export function GallerySection({ itens }) {
  return (
    <div className="galeria-grid">
      {itens.map((item, indice) => (
        <div
          key={item}
          className="galeria-grid__item"
          style={{ background: CORES_PLACEHOLDER[indice % CORES_PLACEHOLDER.length] }}
        >
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}
