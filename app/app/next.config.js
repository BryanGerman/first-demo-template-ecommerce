/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: 'standalone',
  images: {
    domains: ['https://imagesecommerce.s3.amazonaws.com', "s3.amazonaws.com"],
  },
  webpack5: true,
  env: {
    PUBLIC_MERCHANT_ID: process.env.PUBLIC_MERCHANT_ID,
    PRIVATE_MERCHANT_ID: process.env.PRIVATE_MERCHANT_ID,
  }
}
  
module.exports = nextConfig