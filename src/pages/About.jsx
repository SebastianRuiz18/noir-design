import Navbar from "../components/Navbar"; // Asegúrate de que la ruta sea correcta
import useCatalogFromFirebase from "../hooks/useCatalogFromFirebase"; // Importa el hook
  
function About() {
    const catalog = useCatalogFromFirebase();
  return (
        <div>
            <Navbar catalog={catalog} />
            <h1>Sobre Nosotros</h1>
            <p>Noir Design nace con la pasión por los detalles. Creamos invitaciones y cortes personalizados con amor.</p>
        </div>
      );
  }
  
  export default About;
  