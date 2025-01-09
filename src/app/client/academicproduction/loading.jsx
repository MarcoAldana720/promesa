import { Ellipsis } from 'react-css-spinners';

function loading() {
  return (
    <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', height:'80vh' }}>
      <Ellipsis color="#061F57" size={70} />
      <p>Cargando</p>
    </div>
  )
}

export default loading
