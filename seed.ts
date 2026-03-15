import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin
  const hash = await bcrypt.hash('admin123', 10)
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: hash }
  })

  // States
  const states = [
    { name: 'Delhi', slug: 'delhi' },
    { name: 'Maharashtra', slug: 'maharashtra' },
    { name: 'Karnataka', slug: 'karnataka' },
    { name: 'Tamil Nadu', slug: 'tamil-nadu' },
  ]
  for (const s of states) {
    await prisma.state.upsert({ where: { slug: s.slug }, update: {}, create: s })
  }

  // Cities
  const delhi = await prisma.state.findUnique({ where: { slug: 'delhi' } })
  const maha = await prisma.state.findUnique({ where: { slug: 'maharashtra' } })
  const karn = await prisma.state.findUnique({ where: { slug: 'karnataka' } })
  const tn = await prisma.state.findUnique({ where: { slug: 'tamil-nadu' } })

  const cities = [
    { name: 'New Delhi', slug: 'new-delhi', stateId: delhi!.id },
    { name: 'South Delhi', slug: 'south-delhi', stateId: delhi!.id },
    { name: 'Mumbai', slug: 'mumbai', stateId: maha!.id },
    { name: 'Pune', slug: 'pune', stateId: maha!.id },
    { name: 'Bangalore', slug: 'bangalore', stateId: karn!.id },
    { name: 'Chennai', slug: 'chennai', stateId: tn!.id },
  ]
  for (const c of cities) {
    await prisma.city.upsert({ where: { slug: c.slug }, update: {}, create: c })
  }

  // Sample profiles
  const newDelhi = await prisma.city.findUnique({ where: { slug: 'new-delhi' } })
  const mumbai = await prisma.city.findUnique({ where: { slug: 'mumbai' } })

  const profiles = [
    { name: 'Priya Sharma', slug: 'priya-sharma', cityId: newDelhi!.id, stateId: delhi!.id, description: 'Professional service provider in New Delhi. Available 24/7.', age: 24, featured: true, images: '[]' },
    { name: 'Anita Singh', slug: 'anita-singh', cityId: newDelhi!.id, stateId: delhi!.id, description: 'Experienced professional based in Delhi.', age: 26, featured: false, images: '[]' },
    { name: 'Kavya Nair', slug: 'kavya-nair', cityId: mumbai!.id, stateId: maha!.id, description: 'Top rated professional in Mumbai.', age: 23, featured: true, images: '[]' },
  ]
  for (const p of profiles) {
    await prisma.profile.upsert({ where: { slug: p.slug }, update: {}, create: p })
  }

  console.log('Seed complete. Admin: admin / admin123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
