import Link from 'next/link';

const Logo = () => (
  <Link href="/">
    <a className="flex items-center space-x-2">
      <img src="https://imagesecommerce.s3.amazonaws.com/leaf.svg" alt="Logo" width={32} height={32} />
      <span className="hidden sm:inline-block font-extrabold text-3xl text-gray-700">
        MyPlantShop
      </span>
    </a>
  </Link>
);

export default Logo;
