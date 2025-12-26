// import { Link } from "react-router-dom";

export default function ContactUs() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Center Navigation */}
      

      {/* Content Card */}
      <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-4xl font-bold text-center mb-4">
          Contact <span className="text-cyan-600">Blog App</span>
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Have questions or feedback? We'd love to hear from you.
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-cyan-600"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-cyan-600"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Message</label>
            <textarea
              rows="4"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-cyan-600"
              placeholder="Write your message"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
