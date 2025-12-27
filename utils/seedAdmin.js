import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';

async function seedAdmin(defaultMobile, defaultPassword) {
  try {
    const existing = await Admin.findOne({ mobile: defaultMobile }).exec()
    if (!existing) {
      const hash = await bcrypt.hash(defaultPassword, 10)
      await Admin.create({ mobile: defaultMobile, password: hash })
      console.log(`Seeded admin ${defaultMobile}`)
    }
  } catch (err) {
    console.error('seedAdmin error:', err.message)
  }
}

export default seedAdmin
