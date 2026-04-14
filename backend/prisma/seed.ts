import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as bcrypt from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({ url: 'file:./prisma/dev.db' });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('password123', 10);

  const nick = await prisma.user.create({
    data: { name: 'Nick Fury', email: 'nick@slooze.com', password, role: 'ADMIN', country: 'ALL' },
  });
  await prisma.user.create({ data: { name: 'Captain Marvel', email: 'marvel@slooze.com', password, role: 'MANAGER', country: 'INDIA' } });
  await prisma.user.create({ data: { name: 'Captain America', email: 'america@slooze.com', password, role: 'MANAGER', country: 'AMERICA' } });
  await prisma.user.create({ data: { name: 'Thanos', email: 'thanos@slooze.com', password, role: 'MEMBER', country: 'INDIA' } });
  await prisma.user.create({ data: { name: 'Thor', email: 'thor@slooze.com', password, role: 'MEMBER', country: 'INDIA' } });
  await prisma.user.create({ data: { name: 'Travis', email: 'travis@slooze.com', password, role: 'MEMBER', country: 'AMERICA' } });

  await prisma.restaurant.create({
    data: {
      name: 'Biryani House', cuisine: 'Indian', country: 'INDIA',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
      menuItems: { create: [
        { name: 'Chicken Biryani', description: 'Aromatic basmati rice with spiced chicken', price: 299, category: 'Main Course' },
        { name: 'Mutton Biryani', description: 'Slow-cooked mutton with fragrant rice', price: 399, category: 'Main Course' },
        { name: 'Veg Biryani', description: 'Mixed vegetables with basmati rice', price: 199, category: 'Main Course' },
        { name: 'Raita', description: 'Yogurt with cucumber and spices', price: 49, category: 'Sides' },
        { name: 'Gulab Jamun', description: 'Soft milk-solid dumplings in sugar syrup', price: 79, category: 'Dessert' },
      ]},
    },
  });

  await prisma.restaurant.create({
    data: {
      name: 'Spice Court', cuisine: 'North Indian', country: 'INDIA',
      imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
      menuItems: { create: [
        { name: 'Butter Chicken', description: 'Creamy tomato-based chicken curry', price: 349, category: 'Main Course' },
        { name: 'Dal Makhani', description: 'Slow-cooked black lentils in butter', price: 249, category: 'Main Course' },
        { name: 'Garlic Naan', description: 'Soft bread with garlic and butter', price: 59, category: 'Bread' },
        { name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', price: 279, category: 'Starter' },
        { name: 'Mango Lassi', description: 'Chilled yogurt drink with mango', price: 89, category: 'Drinks' },
      ]},
    },
  });

  await prisma.restaurant.create({
    data: {
      name: 'South Bites', cuisine: 'South Indian', country: 'INDIA',
      imageUrl: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400',
      menuItems: { create: [
        { name: 'Masala Dosa', description: 'Crispy crepe with spiced potato filling', price: 149, category: 'Main Course' },
        { name: 'Idli Sambar', description: 'Steamed rice cakes with lentil soup', price: 99, category: 'Breakfast' },
        { name: 'Vada', description: 'Crispy lentil fritters', price: 79, category: 'Starter' },
        { name: 'Filter Coffee', description: 'Traditional South Indian coffee', price: 49, category: 'Drinks' },
        { name: 'Payasam', description: 'Sweet rice pudding with cardamom', price: 89, category: 'Dessert' },
      ]},
    },
  });

  await prisma.restaurant.create({
    data: {
      name: 'Burger Barn', cuisine: 'American', country: 'AMERICA',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      menuItems: { create: [
        { name: 'Classic Cheeseburger', description: 'Beef patty with cheddar, lettuce, tomato', price: 12.99, category: 'Burgers' },
        { name: 'BBQ Bacon Burger', description: 'Smoky BBQ sauce with crispy bacon', price: 14.99, category: 'Burgers' },
        { name: 'Veggie Burger', description: 'Plant-based patty with fresh veggies', price: 11.99, category: 'Burgers' },
        { name: 'Loaded Fries', description: 'Fries with cheese sauce and jalapeños', price: 6.99, category: 'Sides' },
        { name: 'Chocolate Milkshake', description: 'Thick creamy chocolate shake', price: 5.99, category: 'Drinks' },
      ]},
    },
  });

  await prisma.restaurant.create({
    data: {
      name: 'Pizza Palace', cuisine: 'Italian-American', country: 'AMERICA',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
      menuItems: { create: [
        { name: 'Pepperoni Pizza', description: 'Classic pepperoni on tomato sauce', price: 15.99, category: 'Pizza' },
        { name: 'BBQ Chicken Pizza', description: 'Grilled chicken with BBQ sauce', price: 16.99, category: 'Pizza' },
        { name: 'Margherita Pizza', description: 'Fresh mozzarella and basil', price: 13.99, category: 'Pizza' },
        { name: 'Caesar Salad', description: 'Romaine lettuce with Caesar dressing', price: 8.99, category: 'Salads' },
        { name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 4.99, category: 'Sides' },
      ]},
    },
  });

  await prisma.restaurant.create({
    data: {
      name: 'Texas BBQ', cuisine: 'BBQ', country: 'AMERICA',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
      menuItems: { create: [
        { name: 'Beef Brisket', description: 'Slow-smoked beef brisket', price: 22.99, category: 'BBQ' },
        { name: 'Pulled Pork Sandwich', description: 'Tender pulled pork on brioche bun', price: 13.99, category: 'Sandwiches' },
        { name: 'BBQ Ribs Half Rack', description: 'Smoky pork ribs with BBQ sauce', price: 24.99, category: 'BBQ' },
        { name: 'Coleslaw', description: 'Creamy homemade coleslaw', price: 3.99, category: 'Sides' },
        { name: 'Sweet Tea', description: 'Southern-style sweet iced tea', price: 2.99, category: 'Drinks' },
      ]},
    },
  });

  await prisma.paymentMethod.create({ data: { userId: nick.id, type: 'CREDIT_CARD', last4: '4242', holderName: 'Nick Fury' } });
  await prisma.paymentMethod.create({ data: { userId: nick.id, type: 'DEBIT_CARD', last4: '1234', holderName: 'Nick Fury' } });

  console.log('Seed complete! Password for all users: password123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
