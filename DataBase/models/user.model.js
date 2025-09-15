import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 10,
    },
    secName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 10,
    },
    familyName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 10,
    },
    userName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    
    qrCode: String,
    
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        minlength: 11,
        maxlength: 11,
    },
    isConfirmed: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ["SuperAdmin", "Admin", "User"],
        default: "User"
    },
    wallet: {
        type: Number,
        default: 0
    },
    walletHistory: [
      {
        amount: Number,
        operation: String,
        description: String,
        performedBy: {
          adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
          },
          adminName: String,
          adminRole: {
            type: String,
            enum: ["SuperAdmin", "Admin", "User"],
            required: true
          }
        },
        walletOwner: {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
          },
          userName: String
        },
        previousBalance: Number,
        newBalance: Number,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "booking"
      }
    ]
}, { timestamps: true });


userSchema.pre("save", function (next) {
  this.userName = `${this.firstName} ${this.secName} ${this.familyName}`;
  next();
});


const userModel = mongoose.model("user", userSchema);
export default userModel;
