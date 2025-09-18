import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { 
  MapPin, 
  Camera, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  X,
  ArrowLeft,
  ArrowRight,
  Send
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { InteractiveMap } from './interactive-map';

interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  role: 'user' | 'volunteer' | 'admin';
  profilePhoto?: string;
}

interface ReportIssueProps {
  user: User;
  accessToken: string;
  onSuccess: () => void;
}

const issueCategories = [
  { value: 'pothole', label: 'Pothole', description: 'Road damage and potholes' },
  { value: 'streetlight', label: 'Streetlight', description: 'Broken or dim streetlights' },
  { value: 'garbage', label: 'Garbage', description: 'Illegal dumping and waste issues' },
  { value: 'water_leak', label: 'Water Leak', description: 'Water pipe leaks and flooding' },
  { value: 'sidewalk', label: 'Sidewalk', description: 'Damaged sidewalks and walkways' },
  { value: 'traffic', label: 'Traffic Signal', description: 'Malfunctioning traffic lights' },
  { value: 'graffiti', label: 'Graffiti', description: 'Vandalism and property damage' },
  { value: 'other', label: 'Other', description: 'Other civic issues' }
];

const priorityLevels = [
  { value: 'low', label: 'Low Priority', description: 'Minor inconvenience', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium Priority', description: 'Moderate impact', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High Priority', description: 'Significant impact', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgent', description: 'Safety hazard', color: 'bg-red-100 text-red-800' }
];

export function ReportIssue({ user, accessToken, onSuccess }: ReportIssueProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    address: '',
    locationCoords: { lat: 0, lng: 0 },
    photo: null as File | null
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Photo size must be less than 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, photo: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photo: null }));
    setPhotoPreview(null);
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding to get address
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=YOUR_MAPBOX_TOKEN`
          );
          
          let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          
          if (response.ok) {
            const data = await response.json();
            if (data.features && data.features.length > 0) {
              address = data.features[0].place_name;
            }
          }
          
          setFormData(prev => ({
            ...prev,
            locationCoords: { lat: latitude, lng: longitude },
            address: address
          }));
          
          toast.success('Location detected successfully');
        } catch (error) {
          console.error('Geocoding error:', error);
          setFormData(prev => ({
            ...prev,
            locationCoords: { lat: latitude, lng: longitude },
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          }));
          toast.success('Location detected successfully');
        }
        
        setLocationLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error('Unable to detect location. Please enter address manually.');
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.category && formData.priority;
      case 2:
        return formData.title.trim() && formData.description.trim();
      case 3:
        return formData.address.trim();
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      // Create form data for file upload
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('priority', formData.priority);
      submitData.append('address', formData.address);
      submitData.append('locationCoords', JSON.stringify(formData.locationCoords));
      
      if (formData.photo) {
        submitData.append('photo', formData.photo);
      }

      const response = await fetch(`https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-8e7bdd01/complaints`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: submitData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        toast.success('Issue reported successfully!');
        setFormData({
          title: '',
          description: '',
          category: '',
          priority: '',
          address: '',
          locationCoords: { lat: 0, lng: 0 },
          photo: null
        });
        setPhotoPreview(null);
        setCurrentStep(1);
        onSuccess();
      } else {
        const { error } = await response.json();
        toast.error(`Failed to report issue: ${error}`);
      }
    } catch (error) {
      console.error('Report submission error:', error);
      if (error.name === 'AbortError') {
        toast.error('Request timed out. Please try again.');
      } else {
        toast.error('Failed to report issue. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= step 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-500'
            } transition-all duration-200`}>
              {currentStep > step ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span>{step}</span>
              )}
            </div>
            {step < 3 && (
              <div className={`w-12 h-1 ${
                currentStep > step ? 'bg-primary' : 'bg-gray-200'
              } transition-all duration-200`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-primary" />
          <span>Issue Category & Priority</span>
        </CardTitle>
        <CardDescription>
          Help us understand the type and urgency of the issue you're reporting
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-medium">Issue Category *</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {issueCategories.map((category) => (
              <div
                key={category.value}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  formData.category === category.value
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
                onClick={() => handleInputChange('category', category.value)}
              >
                <div className="font-medium text-gray-900">{category.label}</div>
                <div className="text-sm text-gray-600 mt-1">{category.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">Priority Level *</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {priorityLevels.map((priority) => (
              <div
                key={priority.value}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  formData.priority === priority.value
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
                onClick={() => handleInputChange('priority', priority.value)}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-900">{priority.label}</div>
                  <Badge className={priority.color}>{priority.value}</Badge>
                </div>
                <div className="text-sm text-gray-600 mt-1">{priority.description}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-primary" />
          <span>Issue Details</span>
        </CardTitle>
        <CardDescription>
          Provide detailed information about the issue to help us resolve it quickly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-base font-medium">Issue Title *</Label>
          <Input
            id="title"
            placeholder="Brief description of the issue (e.g., Large pothole on Main Street)"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="border-gray-300 focus:border-primary"
            maxLength={100}
          />
          <div className="text-xs text-gray-500 text-right">
            {formData.title.length}/100 characters
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-base font-medium">Detailed Description *</Label>
          <Textarea
            id="description"
            placeholder="Provide more details about the issue, including when you noticed it, how it affects the community, and any other relevant information..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="border-gray-300 focus:border-primary min-h-[120px]"
            maxLength={500}
          />
          <div className="text-xs text-gray-500 text-right">
            {formData.description.length}/500 characters
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">Photo Evidence (Optional)</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            {photoPreview ? (
              <div className="relative">
                <ImageWithFallback
                  src={photoPreview}
                  alt="Issue photo preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removePhoto}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-gray-600">Upload a photo of the issue</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                    className="hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Photo
                  </Button>
                  <p className="text-xs text-gray-500">
                    Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const handleLocationSelect = (location: { lat: number; lng: number; address?: string }) => {
    setFormData(prev => ({
      ...prev,
      locationCoords: { lat: location.lat, lng: location.lng },
      address: location.address || prev.address
    }));
  };

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Interactive Map */}
      <InteractiveMap
        selectedLocation={formData.locationCoords.lat !== 0 ? {
          lat: formData.locationCoords.lat,
          lng: formData.locationCoords.lng,
          address: formData.address
        } : null}
        onLocationSelect={handleLocationSelect}
      />

      {/* Address Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>Location Details</span>
          </CardTitle>
          <CardDescription>
            Provide additional details about the exact location of the issue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address" className="text-base font-medium">Address or Location Description *</Label>
            <Textarea
              id="address"
              placeholder="Enter the specific address, intersection, or detailed location description (e.g., 123 Main Street, near the red traffic light, or Corner of Oak Ave and 1st Street)"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="border-gray-300 focus:border-primary min-h-[80px]"
              maxLength={200}
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.address.length}/200 characters
            </div>
          </div>

          {formData.locationCoords.lat !== 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 text-green-800 mb-2">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Location Selected</span>
              </div>
              <div className="text-xs text-green-700">
                <strong>Coordinates:</strong> {formData.locationCoords.lat.toFixed(6)}, {formData.locationCoords.lng.toFixed(6)}
              </div>
            </div>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-blue-900 mb-1">Location Tips</div>
                <ul className="text-blue-800 space-y-1 text-xs">
                  <li>• Click on the map above to select the exact location</li>
                  <li>• Use the search bar to find specific addresses or landmarks</li>
                  <li>• Click the crosshair button to use your current location</li>
                  <li>• Provide additional details in the description field</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Category & Priority';
      case 2: return 'Issue Details';
      case 3: return 'Location & Submit';
      default: return '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Report an Issue</h1>
        <p className="text-gray-600">
          Help improve your community by reporting civic issues
        </p>
        <div className="mt-4">
          <Progress value={(currentStep / 3) * 100} className="w-full max-w-md mx-auto" />
          <p className="text-sm text-gray-500 mt-2">
            Step {currentStep} of 3: {getStepTitle()}
          </p>
        </div>
      </div>

      {renderStepIndicator()}

      {/* Step Content */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="hover:bg-gray-100 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentStep < 3 ? (
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!validateStep(currentStep)}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={loading || !validateStep(3)}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Report
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}