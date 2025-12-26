// import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Center Navigation */}
      

      {/* Content Card */}
      <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-4xl font-bold text-center mb-4">
          About <span className="text-cyan-600">Blog App</span>
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Blog App is a modern platform to read, write, and share your ideas with the world.
        </p>

        <p className="text-gray-700 leading-relaxed">
          Our goal is to create a clean and simple blogging experience where users
          can easily publish posts, explore content from others, and manage their
          own articles. This project is built using the MERN stack with a focus on
          performance, usability, and scalability.
        </p>

        <p className="text-gray-700 leading-relaxed mt-4">
          Whether you are a beginner or an experienced writer, Blog App gives you
          the freedom to express your thoughts without distractions.
        </p>
      </div>
    </div>
  );
}
