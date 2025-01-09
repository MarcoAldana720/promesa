"use client"

import { Ellipsis } from 'react-css-spinners';

function Loading() {
  return (
    <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', height:'80vh' }}>
      <Ellipsis color="#061F57" size={70} />
      <p>Cargando</p>
    </div>
  )
}

export default Loading
