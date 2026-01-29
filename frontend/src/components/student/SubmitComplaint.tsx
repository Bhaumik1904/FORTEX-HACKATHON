import { useState, FormEvent } from 'react';
import { Send, CheckCircle, Sparkles, AlertTriangle, Info } from 'lucide-react';
import { API_URL } from '../../services/api';

const categories = [
  'Hostel - Maintenance',
  'Hostel - Food Quality',
  'Hostel - Cleanliness',
  'Academic - Exam Delays',
  'Academic - Course Issues',
  'Academic - Faculty Concerns',
  'Infrastructure - Classroom',
  'Infrastructure - Library',
  'Infrastructure - Sports Facilities',
  'Facilities - Medical',
  'Facilities - Transport',
  'Other',
];

// Simple AI sentiment analyzer
const analyzeSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
  const negativeWords = ['bad', 'terrible', 'worst', 'horrible', 'awful', 'poor', 'broken', 'dirty', 'unsafe', 'unacceptable', 'urgent', 'serious', 'critical'];
  const positiveWords = ['good', 'great', 'excellent', 'thanks', 'appreciate', 'better'];

  const lowerText = text.toLowerCase();
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;

  if (negativeCount > positiveCount) return 'negative';
  if (positiveCount > negativeCount) return 'positive';
  return 'neutral';
};

// AI Analysis for severity and importance
const performAIAnalysis = (category: string, description: string) => {
  const lowerDesc = description.toLowerCase();

  // Critical keywords
  const criticalWords = ['emergency', 'urgent', 'critical', 'dangerous', 'unsafe', 'broken', 'health', 'medical', 'injury', 'fire', 'flood'];
  const highPriorityWords = ['serious', 'major', 'severe', 'terrible', 'horrible', 'awful', 'unacceptable', 'immediate'];
  const mediumPriorityWords = ['concern', 'issue', 'problem', 'delay', 'waiting', 'pending'];

  // Count keyword matches
  const criticalCount = criticalWords.filter(word => lowerDesc.includes(word)).length;
  const highCount = highPriorityWords.filter(word => lowerDesc.includes(word)).length;
  const mediumCount = mediumPriorityWords.filter(word => lowerDesc.includes(word)).length;

  // Determine severity
  let severity: 'Critical' | 'High' | 'Medium' | 'Low' = 'Low';
  let severityScore = 0;

  if (criticalCount > 0) {
    severity = 'Critical';
    severityScore = 95;
  } else if (highCount >= 2 || (highCount >= 1 && mediumCount >= 2)) {
    severity = 'High';
    severityScore = 75;
  } else if (highCount >= 1 || mediumCount >= 2) {
    severity = 'Medium';
    severityScore = 50;
  } else if (mediumCount >= 1) {
    severity = 'Medium';
    severityScore = 40;
  } else {
    severity = 'Low';
    severityScore = 25;
  }

  // Category-based adjustments
  if (category.includes('Medical') || category.includes('Safety')) {
    severityScore = Math.min(severityScore + 20, 100);
    if (severity === 'Low') severity = 'Medium';
  }

  if (category.includes('Academic - Exam')) {
    severityScore = Math.min(severityScore + 15, 100);
  }

  // Sentiment analysis
  const sentiment = analyzeSentiment(description);

  // Importance calculation
  let importance: 'Very High' | 'High' | 'Moderate' | 'Standard' = 'Standard';
  if (severityScore >= 80) importance = 'Very High';
  else if (severityScore >= 60) importance = 'High';
  else if (severityScore >= 35) importance = 'Moderate';

  // Expected response time
  let expectedResponse = '5-7 days';
  if (severity === 'Critical') expectedResponse = '24 hours';
  else if (severity === 'High') expectedResponse = '2-3 days';
  else if (severity === 'Medium') expectedResponse = '3-5 days';

  // Recommendations
  const recommendations = [];
  if (severity === 'Critical') {
    recommendations.push('Consider using Emergency Contact if immediate safety risk');
    recommendations.push('Your complaint will be marked as highest priority');
  } else if (severity === 'High') {
    recommendations.push('Your complaint will be prioritized for quick resolution');
  } else {
    recommendations.push('Your complaint will be processed in regular queue');
  }

  if (sentiment === 'negative') {
    recommendations.push('Strong concern detected - admin will be notified');
  }

  if (description.length < 30) {
    recommendations.push('Consider adding more details for faster resolution');
  }

  return {
    severity,
    severityScore,
    importance,
    sentiment,
    expectedResponse,
    recommendations,
    detectedKeywords: [...criticalWords, ...highPriorityWords].filter(word => lowerDesc.includes(word)),
  };
};

export function SubmitComplaint() {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!category || !description.trim()) {
      alert('Please select a category and enter a description first');
      return;
    }

    setAnalyzing(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const analysis = performAIAnalysis(category, description);
      setAiAnalysis(analysis);
      setAnalyzing(false);
    }, 1500);
  };

  const handleSubmit = async (e: FormEvent) => {

    e.preventDefault();

    if (!category || !description.trim()) return;

    // If not analyzed yet, analyze first
    if (!aiAnalysis) {
      alert('Please analyze your complaint first to see AI insights');
      handleAnalyze();
      return;
    }

    // AI Analysis
    const sentiment = analyzeSentiment(description);
    const aiCategory = category.split(' - ')[0]; // Extract main category

    await fetch(`${API_URL}/complaints`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        category,
        description,
        sentiment,
        aiCategory
      }),
    });



    // Show success message
    setSubmitted(true);
    setCategory('');
    setDescription('');
    setAiAnalysis(null);

    // Reset success message after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-50 border-red-500 text-red-900';
      case 'High': return 'bg-orange-50 border-orange-500 text-orange-900';
      case 'Medium': return 'bg-yellow-50 border-yellow-500 text-yellow-900';
      default: return 'bg-blue-50 border-blue-500 text-blue-900';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'High': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'Medium': return <Info className="w-5 h-5 text-yellow-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Submit a Complaint</h2>
        <p className="text-slate-600">
          Report issues related to hostel, academics, infrastructure, or facilities. AI will analyze your complaint before submission.
        </p>
      </div>

      {submitted && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-900">Complaint submitted successfully!</p>
            <p className="text-sm text-green-700">AI has analyzed your complaint. You can track its status in "My Complaints"</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label htmlFor="category" className="block font-medium text-slate-900 mb-2">
              Category <span className="text-red-600">*</span>
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setAiAnalysis(null); // Reset analysis when category changes
              }}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block font-medium text-slate-900 mb-2">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setAiAnalysis(null); // Reset analysis when description changes
              }}
              rows={6}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
              placeholder="Describe your issue in detail..."
              required
            />
            <p className="text-sm text-slate-500 mt-2">
              Please be specific and include relevant details such as location, timing, and impact.
            </p>
          </div>

          {/* AI Analysis Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={analyzing}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
              {analyzing ? 'Analyzing...' : 'Analyze with AI'}
            </button>
          </div>
        </form>
      </div>

      {/* AI Analysis Report */}
      {aiAnalysis && (
        <div className="mt-6 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-slate-900">AI Analysis Report</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Severity */}
            <div className={`border-l-4 rounded-lg p-4 ${getSeverityColor(aiAnalysis.severity)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getSeverityIcon(aiAnalysis.severity)}
                <span className="font-semibold">Severity Level</span>
              </div>
              <div className="text-2xl font-bold mb-1">{aiAnalysis.severity}</div>
              <div className="text-sm opacity-80">Score: {aiAnalysis.severityScore}/100</div>
            </div>

            {/* Importance */}
            <div className="bg-white border-l-4 border-blue-500 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-slate-900">Importance</span>
              </div>
              <div className="text-2xl font-bold text-blue-900 mb-1">{aiAnalysis.importance}</div>
              <div className="text-sm text-slate-600">Priority classification</div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="text-sm font-medium text-slate-700 mb-1">Detected Sentiment</div>
              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${aiAnalysis.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                aiAnalysis.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                {aiAnalysis.sentiment === 'negative' ? '😟' : aiAnalysis.sentiment === 'positive' ? '😊' : '😐'} {aiAnalysis.sentiment}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="text-sm font-medium text-slate-700 mb-1">Expected Response Time</div>
              <div className="text-lg font-semibold text-slate-900">{aiAnalysis.expectedResponse}</div>
            </div>
          </div>

          {/* Detected Keywords */}
          {aiAnalysis.detectedKeywords.length > 0 && (
            <div className="bg-white rounded-lg p-4 border border-slate-200 mb-4">
              <div className="text-sm font-medium text-slate-700 mb-2">AI Detected Keywords</div>
              <div className="flex flex-wrap gap-2">
                {aiAnalysis.detectedKeywords.map((keyword: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="text-sm font-medium text-slate-700 mb-2">AI Recommendations</div>
            <ul className="space-y-2">
              {aiAnalysis.recommendations.map((rec: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Submit Button */}
          <div className="mt-6 pt-6 border-t border-purple-200">
            <button
              onClick={handleSubmit}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md"
            >
              <Send className="w-5 h-5" />
              Submit Complaint with AI Analysis
            </button>
          </div>
        </div>
      )}

      {/* Information Box */}
      {!aiAnalysis && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Click "Analyze with AI" to get instant severity and importance assessment</li>
            <li>• AI will analyze your complaint for urgency and sentiment</li>
            <li>• Review the AI analysis before submitting</li>
            <li>• Your complaint will be prioritized based on AI analysis</li>
            <li>• Track progress in "My Complaints" section</li>
          </ul>
        </div>
      )}
    </div>
  );
}