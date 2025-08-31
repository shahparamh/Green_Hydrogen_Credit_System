import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

// Load environment variables
dotenv.config();

const migrateUsers = async () => {
  try {
    console.log('🔄 Starting user migration...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Find all users that don't have firstName/lastName but have name
    const usersToMigrate = await User.find({
      $or: [
        { firstName: { $exists: false } },
        { lastName: { $exists: false } },
        { firstName: null },
        { lastName: null }
      ]
    });
    
    console.log(`📊 Found ${usersToMigrate.length} users to migrate`);
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const user of usersToMigrate) {
      try {
        // If user has a name field, split it into firstName and lastName
        if (user.name && !user.firstName && !user.lastName) {
          const nameParts = user.name.trim().split(' ');
          user.firstName = nameParts[0] || 'User';
          user.lastName = nameParts.slice(1).join(' ') || 'Account';
          
          await user.save();
          migratedCount++;
          console.log(`✅ Migrated user: ${user.email} -> ${user.firstName} ${user.lastName}`);
        } else if (!user.firstName && !user.lastName) {
          // Set default values for users without any name
          user.firstName = 'User';
          user.lastName = 'Account';
          
          await user.save();
          migratedCount++;
          console.log(`✅ Set default name for user: ${user.email}`);
        } else {
          skippedCount++;
          console.log(`⏭️  Skipped user: ${user.email} (already has name fields)`);
        }
      } catch (error) {
        console.error(`❌ Error migrating user ${user.email}:`, error.message);
      }
    }
    
    console.log('\n📋 Migration Summary:');
    console.log(`✅ Successfully migrated: ${migratedCount} users`);
    console.log(`⏭️  Skipped: ${skippedCount} users`);
    console.log(`📊 Total processed: ${usersToMigrate.length} users`);
    
    // Verify migration
    const usersWithoutNames = await User.find({
      $or: [
        { firstName: { $exists: false } },
        { lastName: { $exists: false } },
        { firstName: null },
        { lastName: null }
      ]
    });
    
    if (usersWithoutNames.length === 0) {
      console.log('🎉 All users have been successfully migrated!');
    } else {
      console.log(`⚠️  Warning: ${usersWithoutNames.length} users still need migration`);
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateUsers();
}

export default migrateUsers;
