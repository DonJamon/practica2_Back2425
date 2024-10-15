type Producto = {
    id: number;
    nombre: string;
    precio : string;
  };
  
  const productos = [
    { id: 1, nombre: "ProductoA", precio: 30},
    { id: 2, nombre: "ProductoB", precio: 20},
    { id: 3, nombre: "ProductoC", precio: 50},
    { id: 4, nombre: "ProductoD", precio: 10},
  ];
  
  const handler = async (req: Request): Promise<Response> => {
    const method = req.method;
    const url = new URL(req.url);
    const path = url.pathname;
  
    if (method === "GET") {
      if (path === "/productos") {
        const minPrecio = url.searchParams.get("minPrecio");
        const maxPrecio = url.searchParams.get("maxPrecio");
        if(minPrecio && maxPrecio){
            const productosFiltrados = productos.filter((p) => (p.precio < Number(maxPrecio)&&(p.precio > Number(minPrecio))));
            return new Response(JSON.stringify(productosFiltrados), { status: 200 });
        }else if(maxPrecio){
            const productosFiltrados = productos.filter((p) => p.precio < Number(maxPrecio));
            return new Response(JSON.stringify(productosFiltrados), { status: 200 });
        }else if(minPrecio){
            const productosFiltrados = productos.filter((p) => p.precio > Number(minPrecio));
            return new Response(JSON.stringify(productosFiltrados), { status: 200 });
        }else{
            return new Response(JSON.stringify(productos), { status: 200 });
        }        
      }

      else if (path.startsWith("/producto/")) {
        const id = path.split('/')[2];
        const prod = productos.find((p)=> p.id === Number(id))
        return new Response(JSON.stringify(prod), { status: 200 });
      }

      else if (path === "/calcular-promedio"){
        const promedio = productos.reduce((acc,p)=>{
            return p.precio + acc;
        },0)
        return new Response(JSON.stringify(promedio), { status: 200 });
      }
    }  
  
    return new Response("endpoint not found", { status: 404 });
  };
  
  Deno.serve({ port: 3000 }, handler);
  