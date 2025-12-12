export default function Footer(){
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="container mx-auto px-4 py-8 text-center">
        <p>© {new Date().getFullYear()} MyBlog. All rights reserved.</p>
      </div>
    </footer>
  )
}
