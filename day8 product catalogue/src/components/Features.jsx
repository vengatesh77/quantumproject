const features = [
  {
    icon: "🚀",
    title: "Fast Delivery",
    desc: "Free shipping on orders over $99. Delivered in 2–3 business days.",
  },
  {
    icon: "🛡️",
    title: "Secure Payment",
    desc: "256-bit SSL encryption. Your payment information is always safe.",
  },
  {
    icon: "🔄",
    title: "Easy Returns",
    desc: "30-day hassle-free return policy. No questions asked.",
  },
  {
    icon: "💬",
    title: "24/7 Support",
    desc: "Round-the-clock customer support via chat, email, or phone.",
  },
];

export default function Features() {
  return (
    <section className="features-section">
      <div className="container">
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-item">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
