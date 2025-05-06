const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the project root directory
const projectRoot = path.resolve(__dirname, '..');

console.log('🚀 Starting database setup...');

// Function to run a command with elevated permissions if needed
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, {
      ...options,
      shell: true,
      stdio: 'inherit'
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

async function setup() {
  try {
    // Step 1: Generate Prisma Client
    console.log('\n📦 Generating Prisma Client...');
    try {
      await runCommand('npx', ['prisma', 'generate'], { cwd: projectRoot });
      console.log('✅ Prisma Client generated successfully!');
    } catch (error) {
      console.error('⚠️ Could not generate Prisma client:', error.message);
      console.log('Continuing with setup...');
    }

    // Step 2: Run database migrations
    console.log('\n🔄 Running database migrations...');
    try {
      await runCommand('npx', ['prisma', 'migrate', 'dev', '--name', 'dashboard-models'], { cwd: projectRoot });
      console.log('✅ Database migrations applied successfully!');
    } catch (error) {
      console.error('⚠️  Migration error:', error.message);
      console.log('This might be normal if the migration already exists.');
      console.log('Continuing with setup...');
    }

    // Step 3: Seed the database
    console.log('\n🌱 Seeding the database...');
    try {
      await runCommand('npx', ['ts-node', 'prisma/seed.ts'], { cwd: projectRoot });
      console.log('✅ Database seeded successfully!');
    } catch (error) {
      console.error('❌ Error seeding the database:', error.message);
      process.exit(1);
    }

    console.log('\n🎉 Database setup complete! You can now run the application.');
  } catch (error) {
    console.error('\n❌ Error during database setup:', error.message);
    process.exit(1);
  }
}

setup(); 