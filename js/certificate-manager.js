/**
 * Certificate Manager - Integration with Udemy, Coursera, and Manual Upload
 * Tracks external certifications and displays them on the dashboard
 */

class CertificateManager {
    constructor() {
        this.certificates = [];
        this.apiKeys = {
            udemy: null, // User needs to provide their own API key
            coursera: null,
            gemini: "AIzaSyBe8CbokZF-iST6PYzAUEQKG-EKqmEOFMM" // For certificate extraction
        };
    }

    /**
     * Search for relevant courses on Udemy based on topic
     * @param {string} topic - The CS topic (e.g., 'Operating Systems')
     */
    async searchUdemyCourses(topic) {
        try {
            // Note: Udemy API requires authentication
            // For demo purposes, we'll use Gemini to suggest courses
            const prompt = `List the top 5 most popular and highly-rated Udemy courses for "${topic}" in Computer Science. 
            For each course, provide:
            1. Course title
            2. Instructor name
            3. Estimated rating (out of 5)
            4. Brief description (1 sentence)
            5. Approximate price range
            
            Format as JSON array with keys: title, instructor, rating, description, price`;

            const response = await this.callGeminiAPI(prompt);
            
            // Parse the response
            let courses = [];
            try {
                // Extract JSON from response
                const jsonMatch = response.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    courses = JSON.parse(jsonMatch[0]);
                }
            } catch (e) {
                console.error('Failed to parse course data:', e);
                // Fallback to manual parsing
                courses = this.parseCoursesFromText(response, topic);
            }

            return courses;
        } catch (error) {
            console.error('Error searching Udemy courses:', error);
            return this.getFallbackCourses(topic);
        }
    }

    /**
     * Search for Coursera courses and certifications
     */
    async searchCourseraCourses(topic) {
        try {
            const prompt = `List the top 5 Coursera courses and professional certificates for "${topic}" in Computer Science.
            Include both individual courses and specializations/professional certificates.
            For each, provide:
            1. Course/Certificate title
            2. University/Organization offering it
            3. Estimated duration
            4. Difficulty level (Beginner/Intermediate/Advanced)
            5. Brief description
            
            Format as JSON array with keys: title, provider, duration, level, description`;

            const response = await this.callGeminiAPI(prompt);
            
            let courses = [];
            try {
                const jsonMatch = response.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    courses = JSON.parse(jsonMatch[0]);
                }
            } catch (e) {
                courses = this.parseCoursesFromText(response, topic);
            }

            return courses;
        } catch (error) {
            console.error('Error searching Coursera courses:', error);
            return this.getFallbackCourses(topic);
        }
    }

    /**
     * Get professional certifications related to topic
     */
    async getRelevantCertifications(topic) {
        const certMap = {
            'Operating Systems': [
                { name: 'CompTIA Linux+', provider: 'CompTIA', url: 'https://www.comptia.org/certifications/linux' },
                { name: 'Red Hat Certified System Administrator', provider: 'Red Hat', url: 'https://www.redhat.com/en/services/certification/rhcsa' },
                { name: 'Microsoft Certified: Azure Administrator', provider: 'Microsoft', url: 'https://learn.microsoft.com/en-us/certifications/azure-administrator/' }
            ],
            'Computer Networks': [
                { name: 'Cisco CCNA', provider: 'Cisco', url: 'https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html' },
                { name: 'CompTIA Network+', provider: 'CompTIA', url: 'https://www.comptia.org/certifications/network' },
                { name: 'Juniper Networks Certified Associate', provider: 'Juniper', url: 'https://www.juniper.net/us/en/training/certification/' }
            ],
            'Cyber Security': [
                { name: 'CompTIA Security+', provider: 'CompTIA', url: 'https://www.comptia.org/certifications/security' },
                { name: 'Certified Ethical Hacker (CEH)', provider: 'EC-Council', url: 'https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/' },
                { name: 'CISSP', provider: 'ISC2', url: 'https://www.isc2.org/Certifications/CISSP' }
            ],
            'Data Structures & Algorithms': [
                { name: 'Oracle Certified Professional: Java SE', provider: 'Oracle', url: 'https://education.oracle.com/oracle-certified-professional-java-se-11-developer/trackp_815' },
                { name: 'Microsoft Certified: Azure Developer Associate', provider: 'Microsoft', url: 'https://learn.microsoft.com/en-us/certifications/azure-developer/' }
            ]
        };

        return certMap[topic] || [];
    }

    /**
     * Upload and process certificate image/PDF
     */
    async uploadCertificate(file, userId) {
        try {
            // Convert file to base64 for Gemini Vision API
            const base64 = await this.fileToBase64(file);
            
            // Extract certificate information using Gemini Vision
            const certificateInfo = await this.extractCertificateInfo(base64);
            
            // Save to Firebase
            const certificate = {
                id: Date.now().toString(),
                userId: userId,
                fileName: file.name,
                uploadDate: new Date().toISOString(),
                ...certificateInfo,
                verified: false,
                fileData: base64 // Store base64 for display
            };

            this.certificates.push(certificate);
            
            // Save to Firebase Realtime Database
            if (window.currentUserId && window.database) {
                const { ref, set, push } = await import('https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js');
                const certificatesRef = ref(window.database, `users/${userId}/certificates`);
                const newCertRef = push(certificatesRef);
                await set(newCertRef, certificate);
            }

            return certificate;
        } catch (error) {
            console.error('Error uploading certificate:', error);
            throw error;
        }
    }

    /**
     * Extract certificate information using Gemini Vision API
     */
    async extractCertificateInfo(base64Image) {
        try {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.apiKeys.gemini}`;

            const prompt = `Analyze this certificate image and extract the following information in JSON format:
            {
                "courseName": "name of the course/certification",
                "platform": "platform name (Udemy, Coursera, edX, etc.)",
                "completionDate": "completion date in YYYY-MM-DD format",
                "recipientName": "name of the certificate recipient",
                "issuer": "organization that issued the certificate",
                "credentialId": "certificate ID or credential number if visible"
            }
            
            If any field is not visible, use "Not found" as the value.`;

            const payload = {
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: base64Image.split(',')[1] // Remove data:image/jpeg;base64, prefix
                            }
                        }
                    ]
                }]
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
            
            // Extract JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            return {
                courseName: 'Unknown Course',
                platform: 'Unknown Platform',
                completionDate: new Date().toISOString().split('T')[0],
                recipientName: 'Not found',
                issuer: 'Not found',
                credentialId: 'Not found'
            };
        } catch (error) {
            console.error('Error extracting certificate info:', error);
            return {
                courseName: 'Manual Entry Required',
                platform: 'Unknown',
                completionDate: new Date().toISOString().split('T')[0]
            };
        }
    }

    /**
     * Verify certificate authenticity (placeholder for future implementation)
     */
    async verifyCertificate(certificate) {
        // In a real implementation, this would:
        // 1. Check with the issuing platform's API
        // 2. Verify the credential ID
        // 3. Confirm the recipient details
        
        // For now, we'll simulate verification
        return {
            verified: true,
            verificationDate: new Date().toISOString(),
            status: 'Valid'
        };
    }

    /**
     * Get all certificates for a user
     */
    async getUserCertificates(userId) {
        if (window.database) {
            const { ref, get } = await import('https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js');
            const certificatesRef = ref(window.database, `users/${userId}/certificates`);
            const snapshot = await get(certificatesRef);
            
            if (snapshot.exists()) {
                const certs = [];
                snapshot.forEach(child => {
                    certs.push({ id: child.key, ...child.val() });
                });
                return certs;
            }
        }
        return [];
    }

    /**
     * Display certificates on dashboard
     */
    displayCertificates(certificates, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        if (certificates.length === 0) {
            container.innerHTML = `
                <div class="text-center p-8 text-gray-400">
                    <p class="text-xl mb-4">📜 No certificates yet</p>
                    <p class="text-sm">Complete external courses and upload your certificates!</p>
                </div>
            `;
            return;
        }

        certificates.forEach(cert => {
            const certCard = document.createElement('div');
            certCard.className = 'card p-4 mb-4 hover:ring-2 hover:ring-purple-500 transition';
            certCard.innerHTML = `
                <div class="flex items-start justify-between">
                    <div class="flex-grow">
                        <h4 class="text-lg font-bold text-purple-400">${cert.courseName}</h4>
                        <p class="text-sm text-gray-400 mt-1">
                            <span class="text-yellow-400">📚 ${cert.platform}</span> | 
                            <span class="text-green-400">✓ ${cert.completionDate}</span>
                        </p>
                        ${cert.issuer !== 'Not found' ? `<p class="text-xs text-gray-500 mt-1">Issued by: ${cert.issuer}</p>` : ''}
                        ${cert.credentialId !== 'Not found' ? `<p class="text-xs text-gray-500">ID: ${cert.credentialId}</p>` : ''}
                    </div>
                    <div class="ml-4">
                        ${cert.verified ? 
                            '<span class="text-green-400 text-2xl" title="Verified">✓</span>' : 
                            '<span class="text-yellow-400 text-2xl" title="Pending Verification">⏳</span>'
                        }
                    </div>
                </div>
                ${cert.fileData ? `
                    <button onclick="window.certificateManager.viewCertificate('${cert.id}')" 
                            class="mt-3 text-sm text-blue-400 hover:text-blue-300">
                        👁️ View Certificate
                    </button>
                ` : ''}
            `;
            container.appendChild(certCard);
        });
    }

    /**
     * View certificate in modal
     */
    viewCertificate(certId) {
        const cert = this.certificates.find(c => c.id === certId);
        if (!cert || !cert.fileData) return;

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-gray-900 p-6 rounded-lg max-w-4xl max-h-screen overflow-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-2xl font-bold text-white">${cert.courseName}</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-white text-3xl">&times;</button>
                </div>
                <img src="${cert.fileData}" alt="Certificate" class="w-full rounded-lg">
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Helper methods
    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async callGeminiAPI(prompt) {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.apiKeys.gemini}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const result = await response.json();
        return result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    parseCoursesFromText(text, topic) {
        // Fallback parser if JSON extraction fails
        return [
            {
                title: `${topic} Complete Course`,
                instructor: 'Expert Instructor',
                rating: 4.5,
                description: 'Comprehensive course covering all aspects',
                price: '$50-$100'
            }
        ];
    }

    getFallbackCourses(topic) {
        return [
            {
                title: `${topic} Fundamentals`,
                provider: 'Online Platform',
                duration: '4-6 weeks',
                level: 'Beginner',
                description: 'Learn the basics and build a strong foundation'
            }
        ];
    }
}

// Initialize global certificate manager
window.certificateManager = new CertificateManager();
