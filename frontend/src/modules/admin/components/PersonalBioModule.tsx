import React, { useState, useEffect, useMemo } from 'react';
import {
  User, Mail, GraduationCap, Briefcase, Heart, FileText,
  Search, Plus, Trash2, Edit3, Save, X, Lock, CheckCircle2,
  AlertCircle
} from 'lucide-react';

export interface BioField {
  id?: string;
  category: string;
  fieldKey: string;
  fieldLabel: string;
  fieldValue: string;
  fieldType: string;
  isCustom: boolean;
  sortOrder: number;
}

export type CategoryKey = 'BASIC' | 'CONTACT' | 'EDUCATION' | 'PROFESSIONAL' | 'INTERESTS' | 'RECORDS';

interface CategoryConfig {
  key: CategoryKey;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  description: string;
  accent: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    key: 'BASIC',
    label: 'Basic Information',
    icon: User,
    description: 'Personal identity, demographics, and background summary.',
    accent: 'var(--accent-cyan)',
  },
  {
    key: 'CONTACT',
    label: 'Contact Information',
    icon: Mail,
    description: 'Confidential communication channels and residential addresses.',
    accent: '#38bdf8',
  },
  {
    key: 'EDUCATION',
    label: 'Education History',
    icon: GraduationCap,
    description: 'Academic background, universities, marks, and qualifications.',
    accent: '#818cf8',
  },
  {
    key: 'PROFESSIONAL',
    label: 'Professional Profile',
    icon: Briefcase,
    description: 'Career path, previous engagements, technical skillsets, and aspirations.',
    accent: '#34d399',
  },
  {
    key: 'INTERESTS',
    label: 'Personal Interests',
    icon: Heart,
    description: 'Fitness passions, sports, hobbies, and personal lifestyle objectives.',
    accent: '#fbbf24',
  },
  {
    key: 'RECORDS',
    label: 'Important Personal Records',
    icon: FileText,
    description: 'Confidential milestones, private notes, and sensitive records.',
    accent: '#f43f5e',
  },
];

export const PersonalBioModule: React.FC = () => {
  const [fields, setFields] = useState<BioField[]>([]);
  const [editedFields, setEditedFields] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('BASIC');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Custom Field Modal State
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customLabel, setCustomLabel] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [customType, setCustomType] = useState('text');

  // Load Bio Data from backend (or local storage fallback)
  const fetchBio = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/private/personal-bio', {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        const all: BioField[] = [];
        if (data.categories) {
          Object.values(data.categories).forEach((catList: any) => {
            all.push(...catList);
          });
        }
        setFields(all);
        initEditedFields(all);
      } else {
        loadLocalFallback();
      }
    } catch {
      loadLocalFallback();
    } finally {
      setLoading(false);
    }
  };

  const loadLocalFallback = () => {
    const cached = localStorage.getItem('girish_personal_bio_vault');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setFields(parsed);
        initEditedFields(parsed);
        return;
      } catch {
        // ignore
      }
    }
    // Initialize empty baseline template
    const defaultTemplate: BioField[] = [
      // Category A: Basic Information
      { category: 'BASIC', fieldKey: 'fullName', fieldLabel: 'Full Name', fieldValue: '', fieldType: 'text', isCustom: false, sortOrder: 1 },
      { category: 'BASIC', fieldKey: 'dob', fieldLabel: 'Date of Birth', fieldValue: '', fieldType: 'date', isCustom: false, sortOrder: 2 },
      { category: 'BASIC', fieldKey: 'age', fieldLabel: 'Age', fieldValue: '', fieldType: 'number', isCustom: false, sortOrder: 3 },
      { category: 'BASIC', fieldKey: 'gender', fieldLabel: 'Gender', fieldValue: '', fieldType: 'text', isCustom: false, sortOrder: 4 },
      { category: 'BASIC', fieldKey: 'bloodGroup', fieldLabel: 'Blood Group', fieldValue: '', fieldType: 'text', isCustom: false, sortOrder: 5 },
      { category: 'BASIC', fieldKey: 'nationality', fieldLabel: 'Nationality', fieldValue: '', fieldType: 'text', isCustom: false, sortOrder: 6 },
      { category: 'BASIC', fieldKey: 'languagesKnown', fieldLabel: 'Languages Known', fieldValue: '', fieldType: 'text', isCustom: false, sortOrder: 7 },
      { category: 'BASIC', fieldKey: 'personalDescription', fieldLabel: 'Personal Description', fieldValue: '', fieldType: 'textarea', isCustom: false, sortOrder: 8 },

      // Category B: Contact Information
      { category: 'CONTACT', fieldKey: 'personalEmail', fieldLabel: 'Personal Email', fieldValue: '', fieldType: 'email', isCustom: false, sortOrder: 1 },
      { category: 'CONTACT', fieldKey: 'phoneNumber', fieldLabel: 'Phone Number', fieldValue: '', fieldType: 'tel', isCustom: false, sortOrder: 2 },
      { category: 'CONTACT', fieldKey: 'alternateContact', fieldLabel: 'Alternate Contact', fieldValue: '', fieldType: 'tel', isCustom: false, sortOrder: 3 },
      { category: 'CONTACT', fieldKey: 'currentAddress', fieldLabel: 'Current Address', fieldValue: '', fieldType: 'textarea', isCustom: false, sortOrder: 4 },
      { category: 'CONTACT', fieldKey: 'permanentAddress', fieldLabel: 'Permanent Address', fieldValue: '', fieldType: 'textarea', isCustom: false, sortOrder: 5 },
      { category: 'CONTACT', fieldKey: 'emergencyContact', fieldLabel: 'Emergency Contact', fieldValue: '', fieldType: 'text', isCustom: false, sortOrder: 6 },

      // Category C: Education
      { category: 'EDUCATION', fieldKey: 'schoolDetails', fieldLabel: 'School Details (SSLC / High School)', fieldValue: '', fieldType: 'textarea', isCustom: false, sortOrder: 1 },
      { category: 'EDUCATION', fieldKey: 'undergraduateDetails', fieldLabel: 'Undergraduate Details (BCA / Degree)', fieldValue: '', fieldType: 'textarea', isCustom: false, sortOrder: 2 },
      { category: 'EDUCATION', fieldKey: 'postgraduateDetails', fieldLabel: 'Postgraduate Details (MCA / Master)', fieldValue: '', fieldType: 'textarea', isCustom: false, sortOrder: 3 },
      { category: 'EDUCATION', fieldKey: 'university', fieldLabel: 'University / Institution', fieldValue: '', fieldType: 'text', isCustom: false, sortOrder: 4 },
      { category: 'EDUCATION', fieldKey: 'academicYear', fieldLabel: 'Academic Year', fieldValue: '', fieldType: 'text', isCustom: false, sortOrder: 5 },
      { category: 'EDUCATION', fieldKey: 'cgpaPercentage', fieldLabel: 'CGPA / Percentage', fieldValue: '', fieldType: 'text', isCustom: false, sortOrder: 6 },
      { category: 'EDUCATION', fieldKey: 'certifications', fieldLabel: 'Certifications', fieldValue: '', fieldType: 'textarea', isCustom: false, sortOrder: 7 },

      // Category D: Professional Information
      { category: 'PROFESSIONAL', fieldKey: 'careerStatus', fieldLabel: 'Current Career Status', fieldValue: '', fieldType: 'text', isCustom: false, sortOrder: 1 },
      { category: 'PROFESSIONAL', fieldKey: 'workExperience', fieldLabel: 'Work Experience', fieldValue: '', fieldType: 'textarea', isCustom: false, sortOrder: 2 },
      { category: 'PROFESSIONAL', fieldKey: 'previousEmployment', fieldLabel: 'Previous Employment', fieldValue: '', fieldType: 'textarea', isCustom: false, sortOrder: 3 },
      { category: 'PROFESSIONAL', fieldKey: 'technicalSkills', fieldLabel: 'Technical Skills', fieldValue: '', fieldType: 'textarea', isCustom: false, sortOrder: 4 },
      { category: 'PROFESSIONAL', fieldKey: 'professionalCerts', fieldLabel: 'Professional Certifications', fieldValue: '', fieldType: 'textarea', isCustom: false, sortOrder: 5 },
      { category: 'PROFESSIONAL', fieldKey: 'careerGoals', fieldLabel: 'Career Goals', fieldValue: '', fieldType: 'textarea', isCustom: false, sortOrder: 6 },

      // Category E: Personal Interests
      { category: 'INTERESTS', fieldKey: 'hobbies', fieldLabel: 'Hobbies', fieldValue: '', fieldType: 'textarea', isCustom: false, sortOrder: 1 },
      { category: 'INTERESTS', fieldKey: 'fitnessInterests', fieldLabel: 'Fitness Interests', fieldValue: '', fieldType: 'textarea', isCustom: false, sortOrder: 2 },
      { category: 'INTERESTS', fieldKey: 'sports', fieldLabel: 'Sports', fieldValue: '', fieldType: 'text', isCustom: false, sortOrder: 3 },
      { category: 'INTERESTS', fieldKey: 'favouriteActivities', fieldLabel: 'Favourite Activities', fieldValue: '', fieldType: 'textarea', isCustom: false, sortOrder: 4 },
      { category: 'INTERESTS', fieldKey: 'personalGoals', fieldLabel: 'Personal Goals', fieldValue: '', fieldType: 'textarea', isCustom: false, sortOrder: 5 },
      { category: 'INTERESTS', fieldKey: 'travelInterests', fieldLabel: 'Travel Interests', fieldValue: '', fieldType: 'textarea', isCustom: false, sortOrder: 6 },

      // Category F: Important Personal Records
      { category: 'RECORDS', fieldKey: 'importantDates', fieldLabel: 'Important Dates', fieldValue: '', fieldType: 'textarea', isCustom: false, sortOrder: 1 },
      { category: 'RECORDS', fieldKey: 'personalNotes', fieldLabel: 'Personal Notes', fieldValue: '', fieldType: 'textarea', isCustom: false, sortOrder: 2 },
      { category: 'RECORDS', fieldKey: 'privateDocuments', fieldLabel: 'Private Documents', fieldValue: '', fieldType: 'textarea', isCustom: false, sortOrder: 3 },
      { category: 'RECORDS', fieldKey: 'otherInfo', fieldLabel: 'Other Important Information', fieldValue: '', fieldType: 'textarea', isCustom: false, sortOrder: 4 },
    ];
    setFields(defaultTemplate);
    initEditedFields(defaultTemplate);
  };

  const initEditedFields = (items: BioField[]) => {
    const map: Record<string, string> = {};
    items.forEach((f) => {
      map[`${f.category}:${f.fieldKey}`] = f.fieldValue || '';
    });
    setEditedFields(map);
  };

  useEffect(() => {
    fetchBio();
  }, []);

  const handleFieldChange = (category: string, fieldKey: string, value: string) => {
    setEditedFields((prev) => ({
      ...prev,
      [`${category}:${fieldKey}`]: value,
    }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setFeedback(null);

    const updates: BioField[] = fields.map((f) => ({
      ...f,
      fieldValue: editedFields[`${f.category}:${f.fieldKey}`] ?? f.fieldValue,
    }));

    try {
      const res = await fetch('/api/v1/private/personal-bio/batch', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        setFields(updates);
        setIsEditing(false);
        setFeedback({ type: 'success', message: 'Personal Bio changes saved successfully to persistent database.' });
        localStorage.setItem('girish_personal_bio_vault', JSON.stringify(updates));
      } else {
        // Fallback local save
        setFields(updates);
        setIsEditing(false);
        localStorage.setItem('girish_personal_bio_vault', JSON.stringify(updates));
        setFeedback({ type: 'success', message: 'Changes saved locally.' });
      }
    } catch {
      setFields(updates);
      setIsEditing(false);
      localStorage.setItem('girish_personal_bio_vault', JSON.stringify(updates));
      setFeedback({ type: 'success', message: 'Changes saved locally.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelChanges = () => {
    initEditedFields(fields);
    setIsEditing(false);
    setFeedback(null);
  };

  const handleAddCustomField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLabel.trim()) return;

    const newField: BioField = {
      category: selectedCategory,
      fieldKey: `custom_${Date.now()}`,
      fieldLabel: customLabel.trim(),
      fieldValue: customValue.trim(),
      fieldType: customType,
      isCustom: true,
      sortOrder: 99,
    };

    try {
      await fetch('/api/v1/private/personal-bio/custom-field', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          fieldLabel: customLabel.trim(),
          fieldValue: customValue.trim(),
          fieldType: customType,
        }),
      });
    } catch {
      // offline fallback
    }

    const updated = [...fields, newField];
    setFields(updated);
    setEditedFields((prev) => ({
      ...prev,
      [`${selectedCategory}:${newField.fieldKey}`]: customValue.trim(),
    }));
    localStorage.setItem('girish_personal_bio_vault', JSON.stringify(updated));

    setCustomLabel('');
    setCustomValue('');
    setCustomType('text');
    setIsCustomModalOpen(false);
    setFeedback({ type: 'success', message: `Added custom field: "${newField.fieldLabel}".` });
  };

  const handleDeleteField = async (category: string, fieldKey: string, isCustom: boolean) => {
    if (!confirm(`Are you sure you want to ${isCustom ? 'delete' : 'clear'} this field?`)) return;

    try {
      await fetch(`/api/v1/private/personal-bio/${category}/${fieldKey}`, {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch {
      // offline fallback
    }

    let updated: BioField[];
    if (isCustom) {
      updated = fields.filter((f) => !(f.category === category && f.fieldKey === fieldKey));
    } else {
      updated = fields.map((f) => (f.category === category && f.fieldKey === fieldKey ? { ...f, fieldValue: '' } : f));
    }

    setFields(updated);
    setEditedFields((prev) => {
      const next = { ...prev };
      if (isCustom) {
        delete next[`${category}:${fieldKey}`];
      } else {
        next[`${category}:${fieldKey}`] = '';
      }
      return next;
    });
    localStorage.setItem('girish_personal_bio_vault', JSON.stringify(updated));
    setFeedback({ type: 'success', message: 'Field updated.' });
  };

  // Filtered fields based on category and search query
  const filteredFields = useMemo(() => {
    return fields.filter((f) => {
      const matchesCategory = searchQuery.trim() ? true : f.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const val = (editedFields[`${f.category}:${f.fieldKey}`] ?? f.fieldValue ?? '').toLowerCase();
      const label = f.fieldLabel.toLowerCase();
      const cat = f.category.toLowerCase();
      return val.includes(q) || label.includes(q) || cat.includes(q);
    });
  }, [fields, editedFields, selectedCategory, searchQuery]);

  return (
    <div style={moduleContainerStyles}>
      {/* Top Action Bar */}
      <div style={topBarStyles}>
        <div style={searchWrapStyles}>
          <Search size={18} color="var(--text-muted)" style={searchIconStyles} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search across all personal bio fields, categories, records..."
            style={searchInputStyles}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={clearSearchBtnStyles} aria-label="Clear search">
              <X size={16} />
            </button>
          )}
        </div>

        <div style={topActionsStyles}>
          {isEditing ? (
            <>
              <button onClick={handleCancelChanges} disabled={saving} style={cancelBtnStyles}>
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button onClick={handleSaveChanges} disabled={saving} style={saveBtnStyles(saving)}>
                <Save size={16} />
                <span>{saving ? 'SAVING...' : 'SAVE CHANGES'}</span>
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} style={editBtnStyles}>
              <Edit3 size={16} />
              <span>EDIT PROFILE</span>
            </button>
          )}

          <button onClick={() => setIsCustomModalOpen(true)} style={addCustomBtnStyles}>
            <Plus size={16} />
            <span>ADD CUSTOM FIELD</span>
          </button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div style={feedbackBannerStyles(feedback.type)}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} color="#10b981" /> : <AlertCircle size={18} color="#ef4444" />}
          <span style={feedbackTextStyles}>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} style={closeFeedbackBtnStyles}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Category Tabs */}
      {!searchQuery && (
        <div style={tabsRowStyles}>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = fields.filter((f) => f.category === cat.key).length;
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                style={tabBtnStyles(isSelected, cat.accent)}
              >
                <Icon size={18} color={isSelected ? cat.accent : 'var(--text-muted)'} />
                <span style={tabLabelStyles}>{cat.label}</span>
                <span style={tabBadgeStyles(isSelected)}>{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Current Category Header */}
      {!searchQuery && (
        <div style={categoryHeaderCardStyles}>
          <div style={categoryHeaderLeftStyles}>
            <span style={categoryTagStyles}>{selectedCategory}</span>
            <h2 style={categoryTitleStyles}>
              {CATEGORIES.find((c) => c.key === selectedCategory)?.label}
            </h2>
            <p style={categoryDescStyles}>
              {CATEGORIES.find((c) => c.key === selectedCategory)?.description}
            </p>
          </div>
          <div style={privateBadgeStyles}>
            <Lock size={14} color="#10b981" />
            <span>CONFIDENTIAL · PRIVATE BY DEFAULT</span>
          </div>
        </div>
      )}

      {searchQuery && (
        <div style={searchFeedbackStyles}>
          Found {filteredFields.length} field(s) matching &quot;{searchQuery}&quot; across all categories:
        </div>
      )}

      {/* Field Grid */}
      {loading ? (
        <div style={emptyStateStyles}>
          <p>Loading personal bio vault...</p>
        </div>
      ) : (
        <div style={fieldsGridStyles}>
          {filteredFields.map((field) => {
            const key = `${field.category}:${field.fieldKey}`;
            const currentVal = editedFields[key] ?? field.fieldValue ?? '';

            return (
              <div key={key} style={fieldCardStyles(field.isCustom)}>
                <div style={fieldCardHeaderStyles}>
                  <div style={fieldLabelRowStyles}>
                    <span style={fieldLabelStyles}>{field.fieldLabel}</span>
                    {field.isCustom && <span style={customBadgeStyles}>CUSTOM</span>}
                    {searchQuery && <span style={searchCatTagStyles}>{field.category}</span>}
                  </div>

                  {isEditing && (
                    <button
                      onClick={() => handleDeleteField(field.category, field.fieldKey, field.isCustom)}
                      style={deleteFieldBtnStyles}
                      title={field.isCustom ? 'Delete custom field' : 'Clear field value'}
                    >
                      <Trash2 size={14} color="#fca5a5" />
                    </button>
                  )}
                </div>

                {isEditing ? (
                  field.fieldType === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={currentVal}
                      onChange={(e) => handleFieldChange(field.category, field.fieldKey, e.target.value)}
                      placeholder={`Enter ${field.fieldLabel}...`}
                      style={textareaStyles}
                    />
                  ) : (
                    <input
                      type={field.fieldType || 'text'}
                      value={currentVal}
                      onChange={(e) => handleFieldChange(field.category, field.fieldKey, e.target.value)}
                      placeholder={`Enter ${field.fieldLabel}...`}
                      style={inputStyles}
                    />
                  )
                ) : (
                  <div style={fieldValueDisplayStyles(Boolean(currentVal))}>
                    {currentVal ? currentVal : <span style={emptyPlaceholderStyles}>Not specified</span>}
                  </div>
                )}
              </div>
            );
          })}

          {filteredFields.length === 0 && (
            <div style={emptyStateStyles}>
              <p>No fields found. Click &quot;ADD CUSTOM FIELD&quot; to create a new entry.</p>
            </div>
          )}
        </div>
      )}

      {/* Add Custom Field Modal */}
      {isCustomModalOpen && (
        <div style={overlayStyles} role="dialog" aria-modal="true" aria-labelledby="custom-modal-title">
          <div style={modalCardStyles}>
            <div style={modalHeaderStyles}>
              <h3 id="custom-modal-title" style={modalTitleStyles}>Add Custom Field</h3>
              <button onClick={() => setIsCustomModalOpen(false)} style={closeModalBtnStyles}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCustomField} style={modalFormStyles}>
              <div style={modalInputGroupStyles}>
                <label style={modalLabelStyles}>Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as CategoryKey)}
                  style={modalSelectStyles}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label} ({c.key})
                    </option>
                  ))}
                </select>
              </div>

              <div style={modalInputGroupStyles}>
                <label style={modalLabelStyles}>Field Label (e.g. Passport Number, Blood Pressure, Guitar)</label>
                <input
                  type="text"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  placeholder="Enter custom label..."
                  style={inputStyles}
                  required
                />
              </div>

              <div style={modalInputGroupStyles}>
                <label style={modalLabelStyles}>Initial Value</label>
                <input
                  type="text"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  placeholder="Enter initial value (optional)..."
                  style={inputStyles}
                />
              </div>

              <div style={modalInputGroupStyles}>
                <label style={modalLabelStyles}>Field Type</label>
                <select
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  style={modalSelectStyles}
                >
                  <option value="text">Single Line Text</option>
                  <option value="textarea">Multi-line Paragraph</option>
                  <option value="date">Date</option>
                  <option value="number">Numeric</option>
                  <option value="email">Email Address</option>
                  <option value="tel">Phone / Contact</option>
                </select>
              </div>

              <div style={modalActionRowStyles}>
                <button type="button" onClick={() => setIsCustomModalOpen(false)} style={cancelBtnStyles}>
                  Cancel
                </button>
                <button type="submit" style={saveBtnStyles(false)}>
                  Add Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const moduleContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  width: '100%',
};

const topBarStyles: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const searchWrapStyles: React.CSSProperties = {
  position: 'relative',
  flex: '1 1 320px',
  display: 'flex',
  alignItems: 'center',
};

const searchIconStyles: React.CSSProperties = {
  position: 'absolute',
  left: '0.85rem',
  pointerEvents: 'none',
};

const searchInputStyles: React.CSSProperties = {
  width: '100%',
  padding: '0.7rem 2.5rem 0.7rem 2.6rem',
  backgroundColor: 'rgba(15, 23, 42, 0.7)',
  border: '1px solid rgba(148, 163, 184, 0.25)',
  borderRadius: '8px',
  color: '#f8fafc',
  fontSize: '0.875rem',
  outline: 'none',
};

const clearSearchBtnStyles: React.CSSProperties = {
  position: 'absolute',
  right: '0.75rem',
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  cursor: 'pointer',
};

const topActionsStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  flexWrap: 'wrap',
};

const editBtnStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.65rem 1.25rem',
  backgroundColor: 'rgba(0, 240, 255, 0.1)',
  border: '1px solid var(--accent-cyan)',
  color: 'var(--accent-cyan)',
  fontWeight: 700,
  fontSize: '0.85rem',
  letterSpacing: '0.05em',
  borderRadius: '8px',
  cursor: 'pointer',
};

const saveBtnStyles = (saving: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.65rem 1.25rem',
  backgroundColor: 'var(--accent-cyan)',
  color: '#090a0f',
  fontWeight: 700,
  fontSize: '0.85rem',
  letterSpacing: '0.05em',
  border: 'none',
  borderRadius: '8px',
  cursor: saving ? 'not-allowed' : 'pointer',
  opacity: saving ? 0.7 : 1,
});

const cancelBtnStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.65rem 1rem',
  backgroundColor: 'transparent',
  border: '1px solid rgba(148, 163, 184, 0.3)',
  color: 'var(--text-muted)',
  fontSize: '0.85rem',
  borderRadius: '8px',
  cursor: 'pointer',
};

const addCustomBtnStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.65rem 1.1rem',
  backgroundColor: 'rgba(56, 189, 248, 0.1)',
  border: '1px solid rgba(56, 189, 248, 0.3)',
  color: '#38bdf8',
  fontWeight: 600,
  fontSize: '0.85rem',
  borderRadius: '8px',
  cursor: 'pointer',
};

const feedbackBannerStyles = (type: 'success' | 'error'): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.75rem',
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  backgroundColor: type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
  border: `1px solid ${type === 'success' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
});

const feedbackTextStyles: React.CSSProperties = {
  fontSize: '0.85rem',
  color: '#f8fafc',
  flex: 1,
};

const closeFeedbackBtnStyles: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  cursor: 'pointer',
};

const tabsRowStyles: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  overflowX: 'auto',
  paddingBottom: '0.5rem',
  borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
};

const tabBtnStyles = (isSelected: boolean, accent: string): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  padding: '0.65rem 1rem',
  backgroundColor: isSelected ? 'rgba(15, 23, 42, 0.9)' : 'transparent',
  border: isSelected ? `1px solid ${accent}` : '1px solid transparent',
  borderBottom: isSelected ? `2px solid ${accent}` : '1px solid transparent',
  borderRadius: '8px 8px 0 0',
  color: isSelected ? '#f8fafc' : 'var(--text-muted)',
  fontSize: '0.85rem',
  fontWeight: isSelected ? 600 : 500,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s',
});

const tabLabelStyles: React.CSSProperties = {
  whiteSpace: 'nowrap',
};

const tabBadgeStyles = (isSelected: boolean): React.CSSProperties => ({
  padding: '0.1rem 0.45rem',
  borderRadius: '10px',
  backgroundColor: isSelected ? 'rgba(0, 240, 255, 0.2)' : 'rgba(148, 163, 184, 0.15)',
  fontSize: '0.75rem',
  fontWeight: 700,
});

const categoryHeaderCardStyles: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  padding: '1.25rem 1.5rem',
  backgroundColor: 'rgba(15, 23, 42, 0.65)',
  border: '1px solid rgba(148, 163, 184, 0.15)',
  borderRadius: '10px',
};

const categoryHeaderLeftStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
};

const categoryTagStyles: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: 'var(--accent-cyan)',
};

const categoryTitleStyles: React.CSSProperties = {
  fontSize: '1.2rem',
  fontWeight: 700,
  color: '#f8fafc',
  margin: 0,
};

const categoryDescStyles: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  margin: 0,
};

const privateBadgeStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.4rem 0.85rem',
  borderRadius: '20px',
  backgroundColor: 'rgba(16, 185, 129, 0.1)',
  border: '1px solid rgba(16, 185, 129, 0.3)',
  color: '#10b981',
  fontSize: '0.75rem',
  fontFamily: 'monospace',
  fontWeight: 700,
  letterSpacing: '0.05em',
};

const searchFeedbackStyles: React.CSSProperties = {
  fontSize: '0.9rem',
  color: 'var(--text-muted)',
};

const fieldsGridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '1rem',
};

const fieldCardStyles = (isCustom: boolean): React.CSSProperties => ({
  backgroundColor: 'rgba(15, 23, 42, 0.75)',
  border: isCustom ? '1px dashed rgba(56, 189, 248, 0.35)' : '1px solid rgba(148, 163, 184, 0.18)',
  borderRadius: '10px',
  padding: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
  transition: 'border-color 0.2s',
});

const fieldCardHeaderStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const fieldLabelRowStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  flexWrap: 'wrap',
};

const fieldLabelStyles: React.CSSProperties = {
  fontSize: '0.825rem',
  fontWeight: 600,
  color: '#94a3b8',
};

const customBadgeStyles: React.CSSProperties = {
  fontSize: '0.65rem',
  fontFamily: 'monospace',
  padding: '0.1rem 0.35rem',
  borderRadius: '4px',
  backgroundColor: 'rgba(56, 189, 248, 0.2)',
  color: '#38bdf8',
  fontWeight: 700,
};

const searchCatTagStyles: React.CSSProperties = {
  fontSize: '0.65rem',
  fontFamily: 'monospace',
  padding: '0.1rem 0.35rem',
  borderRadius: '4px',
  backgroundColor: 'rgba(0, 240, 255, 0.1)',
  color: 'var(--accent-cyan)',
};

const deleteFieldBtnStyles: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '0.2rem',
  borderRadius: '4px',
};

const inputStyles: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  backgroundColor: 'rgba(9, 14, 26, 0.9)',
  border: '1px solid rgba(148, 163, 184, 0.25)',
  borderRadius: '6px',
  color: '#f8fafc',
  fontSize: '0.875rem',
  outline: 'none',
};

const textareaStyles: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  backgroundColor: 'rgba(9, 14, 26, 0.9)',
  border: '1px solid rgba(148, 163, 184, 0.25)',
  borderRadius: '6px',
  color: '#f8fafc',
  fontSize: '0.875rem',
  fontFamily: 'inherit',
  resize: 'vertical',
  outline: 'none',
};

const fieldValueDisplayStyles = (hasValue: boolean): React.CSSProperties => ({
  fontSize: '0.95rem',
  color: hasValue ? '#f8fafc' : 'rgba(148, 163, 184, 0.5)',
  lineHeight: 1.5,
  minHeight: '1.5rem',
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
});

const emptyPlaceholderStyles: React.CSSProperties = {
  fontStyle: 'italic',
  color: 'rgba(148, 163, 184, 0.45)',
  fontSize: '0.85rem',
};

const emptyStateStyles: React.CSSProperties = {
  gridColumn: '1 / -1',
  padding: '3rem',
  textAlign: 'center',
  color: 'var(--text-muted)',
};

// Modal styles
const overlayStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  backdropFilter: 'blur(8px)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
};

const modalCardStyles: React.CSSProperties = {
  width: '100%',
  maxWidth: '460px',
  backgroundColor: '#0f172a',
  border: '1px solid rgba(0, 240, 255, 0.3)',
  borderRadius: '12px',
  padding: '1.75rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.8)',
};

const modalHeaderStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const modalTitleStyles: React.CSSProperties = {
  fontSize: '1.15rem',
  fontWeight: 700,
  color: '#f8fafc',
  margin: 0,
};

const closeModalBtnStyles: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  cursor: 'pointer',
};

const modalFormStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const modalInputGroupStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
};

const modalLabelStyles: React.CSSProperties = {
  fontSize: '0.825rem',
  fontWeight: 600,
  color: '#cbd5e1',
};

const modalSelectStyles: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  backgroundColor: 'rgba(9, 14, 26, 0.9)',
  border: '1px solid rgba(148, 163, 184, 0.25)',
  borderRadius: '6px',
  color: '#f8fafc',
  fontSize: '0.875rem',
  outline: 'none',
};

const modalActionRowStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '0.75rem',
  marginTop: '0.5rem',
};
