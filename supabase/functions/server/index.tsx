// @ts-ignore
import { Hono } from "npm:hono";
// @ts-ignore
import { cors } from "npm:hono/cors";
// @ts-ignore
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-443fc9b4/health", (c: any) => {
  return c.json({ status: "ok" });
});

// Get menu items
app.get("/make-server-443fc9b4/menu", async (c: any) => {
  try {
    const menu = await kv.get("menu:items");
    if (!menu) {
      // Initialize with sample menu items
      const defaultMenu = [
        {
          id: "1",
          name: "Plov",
          description: "Ənənəvi Azərbaycan plov",
          price: 12.00,
          category: "Əsas yeməklər",
          image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400"
        },
        {
          id: "2",
          name: "Dolma",
          description: "Üzüm yarpağında dolma",
          price: 10.00,
          category: "Əsas yeməklər",
          image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400"
        },
        {
          id: "3",
          name: "Lülə kabab",
          description: "Əl ilə hazırlanmış qoyun əti kabab",
          price: 15.00,
          category: "Əsas yeməklər",
          image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400"
        },
        {
          id: "4",
          name: "Paxlava",
          description: "Azərbaycan şirniyyatı",
          price: 6.00,
          category: "Desertlər",
          image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400"
        },
        {
          id: "5",
          name: "Şəkərbura",
          description: "Badam ilə şirin",
          price: 5.00,
          category: "Desertlər",
          image: "https://images.unsplash.com/photo-1587241321921-91a834d82ffc?w=400"
        },
        {
          id: "6",
          name: "Çay",
          description: "Ənənəvi Azərbaycan çayı",
          price: 2.00,
          category: "İçkilər",
          image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400"
        }
      ];
      await kv.set("menu:items", defaultMenu);
      return c.json(defaultMenu);
    }
    return c.json(menu);
  } catch (error) {
    console.log(`Error fetching menu: ${error}`);
    return c.json({ error: "Menyu yüklənərkən xəta baş verdi" }, 500);
  }
});

// Add menu item (admin only)
app.post("/make-server-443fc9b4/menu", async (c: any) => {
  try {
    const newItem = await c.req.json();
    const menu = await kv.get("menu:items") || [];
    const updatedMenu = [...menu, { ...newItem, id: Date.now().toString() }];
    await kv.set("menu:items", updatedMenu);
    return c.json(updatedMenu);
  } catch (error) {
    console.log(`Error adding menu item: ${error}`);
    return c.json({ error: "Məhsul əlavə edilərkən xəta baş verdi" }, 500);
  }
});

// Update menu item (admin only)
app.put("/make-server-443fc9b4/menu/:id", async (c: any) => {
  try {
    const id = c.req.param("id");
    const updatedItem = await c.req.json();
    const menu = await kv.get("menu:items") || [];
    const updatedMenu = menu.map((item: any) => item.id === id ? { ...updatedItem, id } : item);
    await kv.set("menu:items", updatedMenu);
    return c.json(updatedMenu);
  } catch (error) {
    console.log(`Error updating menu item: ${error}`);
    return c.json({ error: "Məhsul yenilənərkən xəta baş verdi" }, 500);
  }
});

// Delete menu item (admin only)
app.delete("/make-server-443fc9b4/menu/:id", async (c: any) => {
  try {
    const id = c.req.param("id");
    const menu = await kv.get("menu:items") || [];
    const updatedMenu = menu.filter((item: any) => item.id !== id);
    await kv.set("menu:items", updatedMenu);
    return c.json(updatedMenu);
  } catch (error) {
    console.log(`Error deleting menu item: ${error}`);
    return c.json({ error: "Məhsul silinərkən xəta baş verdi" }, 500);
  }
});

// Create order
app.post("/make-server-443fc9b4/orders", async (c: any) => {
  try {
    const orderData = await c.req.json();
    const orderId = Date.now().toString();
    const order = {
      id: orderId,
      ...orderData,
      status: "yeni",
      createdAt: new Date().toISOString()
    };
    await kv.set(`order:${orderId}`, order);
    
    // Add to orders list
    const ordersList = await kv.get("orders:list") || [];
    await kv.set("orders:list", [orderId, ...ordersList]);
    
    return c.json(order);
  } catch (error) {
    console.log(`Error creating order: ${error}`);
    return c.json({ error: "Sifariş yaradılarkən xəta baş verdi" }, 500);
  }
});

// Get all orders (admin only)
app.get("/make-server-443fc9b4/orders", async (c: any) => {
  try {
    const ordersList = await kv.get("orders:list") || [];
    const orders = [];
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const validOrders = [];

    for (const orderId of ordersList) {
      const order = await kv.get(`order:${orderId}`);
      if (order) {
        const orderDate = new Date(order.createdAt);
        if (orderDate > oneDayAgo) {
          orders.push(order);
          validOrders.push(orderId);
        } else {
          // Delete old order
          await kv.del(`order:${orderId}`);
        }
      }
    }
    
    // Update the orders list to remove old orders
    await kv.set("orders:list", validOrders);
    
    return c.json(orders);
  } catch (error) {
    console.log(`Error fetching orders: ${error}`);
    return c.json({ error: "Sifarişlər yüklənərkən xəta baş verdi" }, 500);
  }
});

// Update order status (admin only)
app.put("/make-server-443fc9b4/orders/:id", async (c: any) => {
  try {
    const orderId = c.req.param("id");
    const { status } = await c.req.json();
    const order = await kv.get(`order:${orderId}`);
    if (!order) {
      return c.json({ error: "Sifariş tapılmadı" }, 404);
    }
    const updatedOrder = { ...order, status };
    await kv.set(`order:${orderId}`, updatedOrder);
    return c.json(updatedOrder);
  } catch (error) {
    console.log(`Error updating order status: ${error}`);
    return c.json({ error: "Sifariş statusu yenilənərkən xəta baş verdi" }, 500);
  }
});

// Delete order (admin only)
app.delete("/make-server-443fc9b4/orders/:id", async (c: any) => {
  try {
    const orderId = c.req.param("id");
    const ordersList = await kv.get("orders:list") || [];
    const updatedList = ordersList.filter((id: any) => id !== orderId);
    await kv.set("orders:list", updatedList);
    await kv.del(`order:${orderId}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting order: ${error}`);
    return c.json({ error: "Sifariş silinərkən xəta baş verdi" }, 500);
  }
});

// @ts-ignore
Deno.serve(app.fetch);