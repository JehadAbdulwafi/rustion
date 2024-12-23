import Link from 'next/link'

const footerLinks = {
  features: {
    title: 'Features',
    links: [
      { name: 'Pay Per View Streaming', href: '/features/pay-per-view' },
      { name: 'SRT Streaming', href: '/features/srt-streaming' },
      { name: 'Video CDN', href: '/features/video-cdn' },
      { name: 'Live Streaming CDN', href: '/features/live-streaming-cdn' },
      { name: 'RTMP Server', href: '/features/rtmp-server' },
      { name: 'Live Stream Pre-recorded Video', href: '/features/pre-recorded' },
      { name: 'Live Video Monitoring', href: '/features/video-monitoring' },
      { name: 'Audio Streaming Software', href: '/features/audio-streaming' },
      { name: 'Chat Overlay', href: '/features/chat-overlay' },
    ]
  },
  products: {
    title: 'Products',
    links: [
      { name: 'Live Stream', href: '/products/live-stream' },
      { name: 'Multistream', href: '/products/multistream' },
      { name: 'Video Hosting', href: '/products/video-hosting' },
      { name: 'Video Monetization', href: '/products/monetization' },
      { name: 'OTT apps', href: '/products/ott-apps' },
      { name: 'IP Camera Streaming', href: '/products/ip-camera' },
      { name: 'TV Playout', href: '/products/tv-playout' },
    ]
  },
  solutions: {
    title: 'Solutions',
    links: [
      { name: 'Live TV Streaming', href: '/solutions/live-tv' },
      { name: 'Sports Streaming', href: '/solutions/sports' },
      { name: 'Game Streaming', href: '/solutions/gaming' },
      { name: 'Education Streaming', href: '/solutions/education' },
      { name: 'Church Streaming', href: '/solutions/church' },
      { name: 'Music & Entertainment Streaming', href: '/solutions/entertainment' },
    ]
  },
  tools: {
    title: 'Tools',
    links: [
      { name: 'HLS Stream Tester', href: '/tools/hls-tester' },
      { name: 'Dash Stream Tester', href: '/tools/dash-tester' },
      { name: 'Bandwidth Calculator', href: '/tools/bandwidth-calculator' },
      { name: 'Bitrate Calculator', href: '/tools/bitrate-calculator' },
      { name: 'rustion Developer API', href: '/tools/api' },
      { name: 'Service Status', href: '/tools/status' },
      { name: 'Change Log', href: '/tools/changelog' },
    ]
  },
}

export function Footer() {
  return (
    <footer className="bg-black text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {/* Custom Support Section */}
          <div className="mb-12">
            <h4 className="text-white font-semibold mb-4">Need a custom plan? Talk to us.</h4>
            <p className="mb-4">Let our experts help you out.</p>
            <Link
              href="/contact"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Book a meeting with us
            </Link>
          </div>
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={`hover:text-white transition-colors`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>


        {/* Bottom Links */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-4 md:mb-0">© 2024 rustion Live Streaming, Inc. All rights reserved</p>
            <div className="flex gap-6 text-sm">
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <Link href="/terms" className="hover:text-white">Terms</Link>
              <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/gdpr" className="hover:text-white">GDPR</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
