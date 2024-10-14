/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental:{
        ppr:'incremental',
        serverActions: {
            allowedOrigins: ["refactored-yodel-x4g4pg4rvvfv947-3000.app.github.dev", "localhost:3000"]
          }
    }
};

export default nextConfig;
