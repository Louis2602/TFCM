/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { webpack }) => {
		config.plugins.push(
			new webpack.IgnorePlugin({
				resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
			})
		);

		return config;
	},
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'utfs.io',
			},
			{
				protocol: 'https',
				hostname: 'img.clerk.com',
			},
		],
	},
};

export default nextConfig;
