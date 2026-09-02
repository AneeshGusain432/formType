const apiServerUrl = process.env.API_SERVER_URL ?? "http://api:8000";

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
