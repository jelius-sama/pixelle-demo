# Pixelle 🎨✨  
*A vibrant platform for anime and illustration enthusiasts.*  

Live preview **https://dbpfjfsp23llw.cloudfront.net/**

## 🚀 Introduction  
Pixelle is a beautifully designed **anime image gallery** where artists and enthusiasts can **discover, share, and support** artwork like never before. This demo showcases the core features of **Pixelle**, built with cutting-edge web technologies.

## 🔥 Features  
✅ **Stunning Image Gallery** – Browse high-quality anime artwork & photography.  
✅ **Smooth User Experience** – Built with **Next.js**, **TypeScript**, and **TailwindCSS** for performance.  
✅ **Theming Support** – Enjoy a **dark/light mode** switch for better accessibility.  
✅ **Lightning-Fast Performance** – Optimized using **Server-Side Rendering (SSR)** & caching.  

## 🛠 Tech Stack  
- **Frontend:** Next.js (React), TypeScript, TailwindCSS  
- **State Management:** Context API, Jotai  
- **Backend:** AWS (planned for full version)  
- **Deployment:** Serverless Architecture  

## 📸 Screenshots  
![Mobile view](https://jelius.dev/assets/project-pixelle-portrait.png)  
![Desktop view](https://jelius.dev/assets/project-pixelle-landscape.png)  

## 🚀 Getting Started  

### 1️⃣ Clone the Repo  
```sh  
git clone https://github.com/jelius-sama/pixelle-demo.git  
cd pixelle-demo  
```  

### 2️⃣ Install Dependencies  
```sh  
bun run install  # or npm install  
```  

## 🔑 Environment Variables

This project requires certain environment variables to be set up. Create a **.env** file in the root directory and add the following:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-public-url
NEXT_PUBLIC_SUPABASE_KEY=your-supabase-public-key
SUPABASE_SERVICE_KEY=your-supabase-secret-key
KV_URL=your-reddis-url
KV_REST_API_READ_ONLY_TOKEN=your-rest-api-read-only-token
KV_REST_API_TOKEN=your-rest-api-token
KV_REST_API_URL=your-kv-rest-api-url
```

### ⚠️ Important
- **NEXT_PUBLIC_** variables are exposed to the client-side, so ensure sensitive keys are kept private.
- Do **not** commit your **.env** file to version control. Add it to **.gitignore**.
- You can use **.env.example** as a reference to set up your local environment.

### 3️⃣ Run the Development Server  
```sh  
bun run dev  # or npm run dev  
```  
Your app will be running on **http://localhost:5500** 🎉  

## 📌 Project Structure  
```
 pixelle-demo/
 │── public/            # Static assets (images, fonts, icons)
 │── src/
 │   ├── app/           # Main application entry point
 │   ├── components/    # Reusable UI/Layout components
 │   ├── hooks/         # Custom hooks
 │   ├── server/        # Server Actions
 │   ├── styles/        # Tailwind CSS
 │   ├── utils/         # Helper functions
 │── .gitignore         # Files to be ignored in Git
 │── package.json       # Project metadata & dependencies
 │── README.md          # You are here!
```

## 📜 License  
This project is licensed under the **MIT License**.  
