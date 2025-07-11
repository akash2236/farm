import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Crop, 
  HardHat,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronLeft
} from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db, storage } from '../config/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

interface FarmDetails {
  farmSize: string;
  preferredCrops: string[];
  soilType: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  farmDetails: FarmDetails;
  photoURL?: string;
}

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState('');
  const navigate = useNavigate();

  
  const [profileData, setProfileData] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    location: '',
    farmDetails: {
      farmSize: '',
      preferredCrops: [],
      soilType: ''
    }
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
       if (currentUser?.uid) {
         const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            setProfileData({
              name: data.name || currentUser.displayName || '',
              email: data.email || currentUser.email || '',
              phone: data.phone || '',
              location: data.location || '',
              farmDetails: data.farmDetails || {
                farmSize: '',
                preferredCrops: [],
                soilType: ''
              },
               photoURL: data.photoURL || currentUser.photoURL || ''
            });
            if (data.photoURL || currentUser.photoURL) {
              setPreviewImage(data.photoURL || currentUser.photoURL || '');
             
            }
          }
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('farmDetails.')) {
      const farmField = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        farmDetails: {
          ...prev.farmDetails,
          [farmField]: farmField === 'preferredCrops' ? value.split(',') : value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);
  setError('');
  setSuccess('');

  try {
    if (!currentUser) throw new Error('No user logged in');

    let photoURL: string | undefined = profileData.photoURL;

    if (profileImage) {
      const imageRef = ref(storage, `profile_images/${currentUser.uid}`);
      await uploadBytes(imageRef, profileImage);
      photoURL = await getDownloadURL(imageRef);
    }

    // Update Firebase Auth Profile
    await updateProfile(auth.currentUser!, {
      displayName: profileData.name,
      ...(photoURL && { photoURL }) // ✅ Only update if defined
    });

    const userRef = doc(db, 'users', currentUser.uid);
    const updatedData: any = {
      name: profileData.name,
      phone: profileData.phone,
      location: profileData.location,
      farmDetails: profileData.farmDetails,
    };

    if (photoURL) {
      updatedData.photoURL = photoURL;
    }

    await updateDoc(userRef, updatedData);

    setSuccess('Profile updated successfully!');
    setEditMode(false);
  } catch (err) {
    console.error('Error updating profile:', err);
    setError('Failed to update profile. Please try again.');
  } finally {
    setSaving(false);
    setTimeout(() => {
      setSuccess('');
      setError('');
    }, 3000);
  }
};


  const soilTypes = ['Alluvial', 'Black', 'Red', 'Laterite', 'Mountain', 'Desert', 'Peaty', 'Saline'];
  const commonCrops = ['Wheat', 'Rice', 'Maize', 'Cotton', 'Soybean', 'Potato', 'Tomato', 'Sugarcane'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
       <button
          onClick={() => navigate('/dashboard')}  // Replace with your dashboard route
          className="flex items-center text-green-600 hover:text-green-700"
        >
           <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </motion.div>

      {/* Success/Error Messages */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center"
        >
          <CheckCircle2 className="h-5 w-5 mr-2" />
          {success}
        </motion.div>
      )}
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center"
        >
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </motion.div>
      )}

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Profile Image Section */}
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="h-40 w-40 rounded-full bg-gray-100 overflow-hidden border-4 border-green-100">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-green-50">
                      <User className="h-20 w-20 text-green-400" />
                    </div>
                  )}
                </div>
                
                {editMode && (
                  <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-50">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </label>
                )}
              </div>
              
              {!editMode ? (
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 flex items-center"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setProfileImage(null);
                      if (currentUser?.photoURL) setPreviewImage(currentUser.photoURL);
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Profile Form Sections */}
            <div className="md:col-span-2 space-y-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2 text-green-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg">{profileData.name}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                      <Mail className="h-5 w-5 mr-2 text-gray-400" />
                      {profileData.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    {editMode ? (
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      />
                    ) : (
                      <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                        <Phone className="h-5 w-5 mr-2 text-gray-400" />
                        {profileData.phone || 'Not provided'}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="location"
                        value={profileData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      />
                    ) : (
                      <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                        <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                        {profileData.location || 'Not provided'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Farm Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <HardHat className="h-5 w-5 mr-2 text-green-600" />
                  Farm Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Farm Size (acres)</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="farmDetails.farmSize"
                        value={profileData.farmDetails.farmSize}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg">
                        {profileData.farmDetails.farmSize || 'Not provided'}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
                    {editMode ? (
                      <select
                        name="farmDetails.soilType"
                        value={profileData.farmDetails.soilType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Select soil type</option>
                        {soilTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg">
                        {profileData.farmDetails.soilType || 'Not provided'}
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Crops</label>
                    {editMode ? (
                      <>
                        <input
                          type="text"
                          name="farmDetails.preferredCrops"
                          value={profileData.farmDetails.preferredCrops.join(', ')}
                          onChange={handleInputChange}
                          placeholder="Comma separated list (e.g., Wheat, Rice, Tomato)"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 mb-2"
                        />
                        <div className="text-xs text-gray-500">
                          Common crops: {commonCrops.join(', ')}
                        </div>
                      </>
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg">
                        {profileData.farmDetails.preferredCrops.length > 0 
                          ? profileData.farmDetails.preferredCrops.join(', ')
                          : 'Not provided'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Optional: Crop Recommendations Preview */}
      {profileData.location && profileData.farmDetails.preferredCrops.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Crop className="h-5 w-5 mr-2 text-green-600" />
            Crop Recommendations for {profileData.location}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profileData.farmDetails.preferredCrops.slice(0, 4).map((crop, index) => (
              <div key={index} className="bg-green-50 rounded-lg p-4 flex flex-col items-center">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <Crop className="h-6 w-6 text-green-600" />
                </div>
                <span className="font-medium text-gray-900">{crop}</span>
                <span className="text-xs text-gray-600 mt-1">Good season</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfilePage;