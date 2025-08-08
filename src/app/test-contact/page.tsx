import { ContactForm, NewsletterForm } from '@/components/forms';

export default function TestContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 space-y-12">
        {/* Contact Form Test */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Contact Form Test</h2>
          <ContactForm />
        </div>

        {/* Newsletter Form Tests */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Newsletter Form Tests</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Inline Variant</h3>
              <NewsletterForm variant="inline" />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Footer Variant</h3>
              <div className="bg-gray-800 p-6 rounded-lg">
                <NewsletterForm 
                  variant="footer" 
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Modal Variant</h3>
              <div className="bg-white p-6 border rounded-lg">
                <NewsletterForm 
                  variant="modal"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}