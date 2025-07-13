function Services() {
  const services = [
    {
      title: "General Checkup",
      description: "Routine health exams and diagnostics.",
    },
    {
      title: "Home Doctor Visit",
      description: "Get expert care at your home.",
    },
    {
      title: "Emergency Care",
      description: "24/7 urgent medical attention.",
    },
    {
      title: "Pharmacy Delivery",
      description: "Medical supplies delivered directly to your doorstep.",
    },
    {
      title: "Blood Sample Collection",
      description: "Hassle free lab test collection from your home.",
    },
    {
      title: "Nursing & Home Care",
      description: "Professional care without hospital visits.",
    },
  ]

  return (
    <section
      className="py-12 px-6 bg-white max-w-6xl mx-auto animate-fadeIn"
      aria-labelledby="services-heading"
    >
      <h2
        id="services-heading"
        className="text-3xl font-bold text-center text-blue-900 mb-10"
      >
        Our Services
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-blue-100 p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-700">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Services
