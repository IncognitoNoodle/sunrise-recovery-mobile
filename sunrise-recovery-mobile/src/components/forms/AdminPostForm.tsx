import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Modal } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';

// Validation schema for admin post
const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  content: z.string().min(1, 'Content is required').max(1000, 'Content must be less than 1000 characters'),
  type: z.enum(['announcement', 'motivational', 'event', 'tip']),
  priority: z.enum(['low', 'medium', 'high']),
  is_published: z.boolean(),
  expires_at: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

interface AdminPostFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<PostFormData>;
  isScreenMode?: boolean;
  isEditMode?: boolean;
  postId?: string;
}

export const AdminPostForm: React.FC<AdminPostFormProps> = ({
  onSuccess,
  onCancel,
  initialData,
  isScreenMode = false,
  isEditMode = false,
  postId,
}) => {
  const { profile } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      type: initialData?.type || 'announcement',
      priority: initialData?.priority || 'medium',
      is_published: initialData?.is_published ?? false,
      expires_at: initialData?.expires_at || '',
    },
  });

  const onSubmit = async (data: PostFormData) => {
    if (!profile) {
      Alert.alert('Error', 'You must be logged in to create posts.');
      return;
    }

    try {
      setIsSubmitting(true);

      const postData = {
        title: data.title.trim(),
        content: data.content.trim(),
        type: data.type,
        priority: data.priority,
        is_published: data.is_published,
        expires_at: data.expires_at ? new Date(data.expires_at).toISOString() : null,
        created_by: profile.id,
      };

      if (isEditMode && postId) {
        await api.updateAdminPost(postId, postData);
        Alert.alert('Success', 'Post updated successfully!');
      } else {
        await api.createAdminPost(postData);
        Alert.alert('Success', 'Post created successfully!');
      }

      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const postTypes = [
    { value: 'announcement', label: 'Announcement' },
    { value: 'motivational', label: 'Motivational' },
    { value: 'event', label: 'Event' },
    { value: 'tip', label: 'Tip' },
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  return (
    <>
      {isScreenMode ? (
        // Screen mode - full screen layout
        <View style={styles.screenContainer}>
          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.form}>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Post Title"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter post title"
                    error={errors.title?.message}
                    helper="Keep it concise and engaging"
                  />
                )}
              />

              <Controller
                control={control}
                name="content"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Post Content"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Share your thoughts, recovery tips, or encouraging words with the community..."
                    error={errors.content?.message}
                    helper="Share your message with the community"
                    multiline
                    numberOfLines={8}
                    textAlignVertical="top"
                  />
                )}
              />

              <Controller
                control={control}
                name="type"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.selectContainer}>
                    <Text style={styles.selectLabel}>Post Type</Text>
                    <View style={styles.selectGrid}>
                      {postTypes.map((type) => (
                        <Button
                          key={type.value}
                          title={type.label}
                          variant={value === type.value ? 'primary' : 'outline'}
                          size="small"
                          onPress={() => onChange(type.value)}
                          style={styles.selectButton}
                        />
                      ))}
                    </View>
                    {errors.type && (
                      <Text style={styles.errorText}>{errors.type.message}</Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="priority"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.selectContainer}>
                    <Text style={styles.selectLabel}>Priority Level</Text>
                    <View style={styles.selectGrid}>
                      {priorityLevels.map((priority) => (
                        <Button
                          key={priority.value}
                          title={priority.label}
                          variant={value === priority.value ? 'primary' : 'outline'}
                          size="small"
                          onPress={() => onChange(priority.value)}
                          style={styles.selectButton}
                        />
                      ))}
                    </View>
                    {errors.priority && (
                      <Text style={styles.errorText}>{errors.priority.message}</Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="expires_at"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Expiration Date (Optional)"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="YYYY-MM-DD"
                    helper="Leave empty for no expiration"
                  />
                )}
              />



              <View style={styles.actions}>
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={onCancel}
                  style={styles.cancelButton}
                />
                <Button
                  title={isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Post' : 'Create Post')}
                  onPress={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  style={styles.submitButton}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      ) : (
        // Modal mode - overlay modal layout
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Post</Text>
              <Text style={styles.modalSubtitle}>Share content with your community</Text>
            </View>
            
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.form}>
                <Controller
                  control={control}
                  name="title"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Post Title"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter post title"
                      error={errors.title?.message}
                      helper="Keep it concise and engaging"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="content"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Post Content"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Share your thoughts, recovery tips, or encouraging words with the community..."
                      error={errors.content?.message}
                      helper="Share your message with the community"
                      multiline
                      numberOfLines={8}
                      textAlignVertical="top"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="type"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.selectContainer}>
                      <Text style={styles.selectLabel}>Post Type</Text>
                      <View style={styles.selectGrid}>
                        {postTypes.map((type) => (
                          <Button
                            key={type.value}
                            title={type.label}
                            variant={value === type.value ? 'primary' : 'outline'}
                            size="small"
                            onPress={() => onChange(type.value)}
                            style={styles.selectButton}
                          />
                        ))}
                      </View>
                      {errors.type && (
                        <Text style={styles.errorText}>{errors.type.message}</Text>
                      )}
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name="priority"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.selectContainer}>
                      <Text style={styles.selectLabel}>Priority Level</Text>
                      <View style={styles.selectGrid}>
                        {priorityLevels.map((priority) => (
                          <Button
                            key={priority.value}
                            title={priority.label}
                            variant={value === priority.value ? 'primary' : 'outline'}
                            size="small"
                            onPress={() => onChange(priority.value)}
                            style={styles.selectButton}
                          />
                        ))}
                      </View>
                      {errors.priority && (
                        <Text style={styles.errorText}>{errors.priority.message}</Text>
                      )}
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name="expires_at"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Expiration Date (Optional)"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="YYYY-MM-DD"
                      helper="Leave empty for no expiration"
                    />
                  )}
                />



                <View style={styles.actions}>
                  <Button
                    title="Cancel"
                    variant="outline"
                    onPress={onCancel}
                    style={styles.cancelButton}
                  />
                  <Button
                    title={isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Post' : 'Create Post')}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    style={styles.submitButton}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 20,
    maxHeight: '90%',
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2772AA',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#494949',
    textAlign: 'center',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#f9fafb', // Light background for screen mode
    padding: 20,
  },
  formContainer: {
    flex: 1,
  },
  form: {
    padding: 20,
    gap: 20,
  },
  selectContainer: {
    gap: 8,
  },
  selectLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2772AA',
  },
  selectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectButton: {
    flex: 1,
    minWidth: 80,
  },
  publishContainer: {
    gap: 8,
  },
  publishLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2772AA',
  },
  publishButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  publishButton: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    marginTop: 4,
  },
}); 