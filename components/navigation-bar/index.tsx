import Link from 'next/link';

export function NavigationBar() {
  return (
    <nav className="bg-black text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-chango text-yellow-400" style={{ textShadow: "2px 2px 0px #000" }}>
          VECTORIZER
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="font-chango hover:text-yellow-400 transition-colors">
              Img2SVG
            </Link>
          </li>
          <li>
            <Link href="/rmbg" className="font-chango hover:text-yellow-400 transition-colors">
              Remove Background
            </Link>
          </li>
          <li>
            <Link href="/nine-grid" className="font-chango hover:text-yellow-400 transition-colors">
              Nine Grid
            </Link>
          </li>
          {/* 您可以在这里添加更多导航链接 */}
        </ul>
      </div>
    </nav>
  );
}