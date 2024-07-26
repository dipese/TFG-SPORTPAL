import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import z from 'zod'

const userSchemaZod = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
  nombre: z.string(),
  apellidos: z.string(),
  
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  apellidos: {
    type: String,
    required: true
  },
  elo: [
    {
      elo: {
        type: Number,
        required: false
      },
      sport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sport',
        required: false
      }
    }
  ],
  friendRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  teams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    }
  ],
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }
  ],
  teamEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    }
  ]
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.statics.validateUser = (userData) => {
  return userSchemaZod.parse(userData);
};


export default mongoose.model('User', userSchema);

