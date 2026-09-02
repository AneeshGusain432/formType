const apiServerUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://api:8000";

/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return [
			{
				source: "/trpc/:path*",
				destination: `${apiServerUrl}/trpc/:path*`,
			},
		];
	},
};

export default nextConfig;
