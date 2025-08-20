## 📱 Pages

The application includes the following pages (all rendered dynamically):

- **Home** (`/`): Featured products, categories, and services
- **Products** (`/products`): All products with search and filters
- **Product Details** (`/productInfo?id=<id>`): Individual product view
- **Categories** (`/categories`): Browse by category
- **Category View** (`/category?name=<name>`): Products in specific category
- **Cart** (`/cart`): Shopping cart management
- **Wishlist** (`/wishlist`): Saved items
- **Login** (`/login`): User authentication
- **Signup** (`/signup`): User registration
- **Contact** (`/contact`): Contact form
- **Admin** (`/admin`): Admin panel (admin access only)

## 🔧 Development

### Adding New Components
1. Create a new TypeScript file in `src/components/`
2. Export a class with static methods
3. Import and use in other components

### Adding New Services
1. Create a new TypeScript file in `src/services/`
2. Implement business logic
3. Import and use in components

### Styling
- Use Tailwind CSS utility classes
- Custom styles can be added to the `<style>` tag in `index.html`
- Component-specific styles can be added inline

## 🎯 Key Benefits

1. **Maintainability**: Clean separation of concerns
2. **Reusability**: Components can be used across pages
3. **Type Safety**: TypeScript prevents runtime errors
4. **Performance**: Single page application with dynamic loading
5. **Scalability**: Easy to add new features and components
6. **No Dependencies**: Pure vanilla JavaScript/TypeScript

## 🔐 Admin Access

To access the admin panel:
1. Login with email: `hassan@admin.panel`
2. Password: 1234567890

## 📝 Notes

- All data is stored in browser's localStorage
- No backend server required
- Responsive design for all screen sizes
- Toast notifications for user feedback
- Loading states for better UX

## 🚀 Future Enhancements

- Add more product categories
- Implement checkout process
- Add user profiles
- Implement search functionality
- Add product reviews and ratings
- Implement wishlist sharing
- Add product comparison
- Implement advanced filtering
