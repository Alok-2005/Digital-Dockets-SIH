# Digital Dockets - Certificate Management System

A comprehensive digital platform for streamlining government certificate issuance and management with real-time monitoring capabilities.

## 🌟 Features

- **Dynamic Form Generation**: Configurable forms for different certificate types
- **Multi-level Authorization**: Hierarchical approval system with role-based access
- **Real-time Monitoring**: Track application status and processing times
- **Secure Payments**: Integrated Razorpay payment gateway
- **Digital Signatures**: QR code-based certificate verification
- **Zone Management**: Subzone-based administrative control
- **Analytics Dashboard**: Resource allocation and performance metrics

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern UI library with hooks and context
- **Vite**: Next-generation frontend tooling
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Zustand**: State management
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client
- **React Hot Toast**: Toast notifications
- **MDEditor**: Markdown editor for certificate templates
- **Lucide React**: Icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **JWT**: Authentication
- **Redis**: Session management
- **Multer**: File uploads
- **Razorpay**: Payment processing
- **Bcrypt**: Password hashing
- **Crypto**: Digital signatures

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/digital-dockets.git
cd digital-dockets
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create `.env` files in both Frontend and Backend directories with necessary configurations.

4. Start development servers:
```bash
# Start backend server
npm run start

# Start frontend development server
npm run dev
```

## 🔐 Environment Variables

### Backend
```env
MONGO_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
UPSTASH_REDIS_URL=your_redis_url
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### Frontend
```env
VITE_API_URL=your_backend_url
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

## 📁 Project Structure

```
digital-dockets/
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── utils/
│   │   └── homeComponents/
│   └── public/
└── Backend/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── lib/
    └── uploads/
```

## 🔄 Workflow

1. **User Registration**: Citizens and administrators register with role-based access
2. **Service Configuration**: Admins configure certificate services and forms
3. **Application Submission**: Citizens fill dynamic forms and submit applications
4. **Payment Processing**: Integrated Razorpay for secure payments
5. **Multi-level Authorization**: Applications go through configured approval chain
6. **Certificate Generation**: Automated certificate generation with digital signatures
7. **Verification**: QR code-based certificate verification system

## 🛡️ Security Features

- JWT-based authentication
- Redis session management
- Password hashing with bcrypt
- Digital signatures for certificates
- Role-based access control
- Secure file uploads
- CORS protection

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Government of India for the initiative
- Smart India Hackathon platform
- All contributors and supporters