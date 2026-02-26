import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, RefreshControl, FlatList, Platform } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { Modal, TextInput, TouchableOpacity, Pressable } from 'react-native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface PostFormModalProps {
  visible: boolean;
  post?: Post | null;
  onClose: () => void;
  onSave: (post: Omit<Post, 'id'> & { id?: string }) => void;
  onDelete?: (postId: string) => void;
}

export function PostFormModal({ visible, post, onClose, onSave, onDelete }: PostFormModalProps) {
  const [author, setAuthor] = useState(post?.author || '');
  const [body, setBody] = useState(post?.body || '');

  useEffect(() => {
    if (post) {
      setAuthor(post.author);
      setBody(post.body);
    } else {
      setAuthor('');
      setBody('');
    }
  }, [post, visible]);

  const handleSave = () => {
    if (!author.trim() || !body.trim()) return;
    
    const postData: Omit<Post, 'id'> & { id?: string } = {
      author: author.trim(),
      body: body.trim(),
    };

    if (post?.id) {
      postData.id = post.id;
    }

    onSave(postData);
    onClose();
  };

  const handleDelete = () => {
    if (post?.id && onDelete) {
      onDelete(post.id);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalContainer}>
            <ThemedText type="defaultSemiBold" style={styles.modalTitle}>
              {post ? 'Edit Post' : 'Create New Post'}
            </ThemedText>
            
            <TextInput
              style={styles.input}
              placeholder="Author name"
              value={author}
              onChangeText={setAuthor}
              placeholderTextColor="#999"
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Post content"
              value={body}
              onChangeText={setBody}
              multiline
              numberOfLines={6}
              placeholderTextColor="#999"
            />
            
            <View style={styles.buttonContainer}>
              {post && onDelete && (
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                  <ThemedText style={styles.deleteButtonText}>Delete</ThemedText>
                </TouchableOpacity>
              )}
              <View style={styles.rightButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <ThemedText>Cancel</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.saveButton, (!author.trim() || !body.trim()) && styles.disabledButton]} 
                  onPress={handleSave}
                  disabled={!author.trim() || !body.trim()}
                >
                  <ThemedText style={styles.saveButtonText}>
                    {post ? 'Update' : 'Create'}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

interface Post {
  id: string;
  title?: string;
  body: string;
  author: string;
}

const API_URL = 'http://192.168.20.114:8080/posts';

export function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const fetchPosts = async () => {
    try {
      setError(null);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setModalVisible(true);
  };

  const handleSavePost = async (post: Omit<Post, 'id'> & { id?: string }) => {
    try {
      const isEditing = !!post.id;
      const url = isEditing ? `${API_URL}/${post.id}` : API_URL;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchPosts();
      
      setModalVisible(false);
      setSelectedPost(null);
    } catch (err) {
      console.error('Error saving post:', err);
      setError(err instanceof Error ? err.message : 'Failed to save post');
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`${API_URL}/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchPosts();
      
      setModalVisible(false);
      setSelectedPost(null);
    } catch (err) {
      console.error('Error deleting post:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  const handleDragEnd = async ({ data }: { data: Post[] }) => {
    setPosts(data);
    
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error saving posts order:', err);
      // Optionally revert to original order on error
      await fetchPosts();
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading posts...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText type="defaultSemiBold" style={styles.errorText}>
          Error: {error}
        </ThemedText>
        <ThemedText style={styles.hintText}>
          Make sure the backend is running on http://localhost:8080
        </ThemedText>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PostFormModal
        visible={modalVisible}
        post={selectedPost}
        onClose={() => {
          setModalVisible(false);
          setSelectedPost(null);
        }}
        onSave={handleSavePost}
        onDelete={handleDeletePost}
      />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <ThemedText type="title" style={styles.headerTitle}>Posts</ThemedText>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => {
              setSelectedPost(null);
              setModalVisible(true);
            }}
          >
            <ThemedText style={styles.createButtonText}>+ Create New Post</ThemedText>
          </TouchableOpacity>
        </View>
        <DraggableFlatList
          data={posts}
          keyExtractor={(item) => item.id}
          onDragEnd={handleDragEnd}
          renderItem={({ item, drag, isActive }: RenderItemParams<Post>) => (
            <ScaleDecorator>
              <ThemedView style={[styles.postCard, isActive && styles.activeCard]}>
                <ThemedView style={styles.postHeader}>
                  <TouchableOpacity 
                    onLongPress={drag}
                    disabled={isActive}
                    style={styles.dragHandle}
                  >
                    <ThemedText style={styles.dragIcon}>☰</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.postContent}
                    onPress={() => handlePostClick(item)}
                  >
                    <ThemedText type="defaultSemiBold" style={styles.authorText}>
                      {item.author}
                    </ThemedText>
                    <ThemedText style={styles.idText}>ID: {item.id}</ThemedText>
                  </TouchableOpacity>
                </ThemedView>
                <TouchableOpacity onPress={() => handlePostClick(item)}>
                  <ThemedText style={styles.postBody}>{item.body}</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ScaleDecorator>
          )}
          containerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <ThemedText>No posts available</ThemedText>
            </View>
          }
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  postCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  authorText: {
    fontSize: 16,
  },
  idText: {
    fontSize: 12,
    opacity: 0.5,
  },
  postTitle: {
    marginBottom: 8,
  },
  postBody: {
    opacity: 0.8,
    lineHeight: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 8,
    textAlign: 'center',
  },
  hintText: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 500,
  },
  modalContainer: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
  },
  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#ff3b30',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  activeCard: {
    opacity: 0.7,
    shadowOpacity: 0.3,
    elevation: 8,
  },
  dragHandle: {
    padding: 8,
  },
  dragIcon: {
    fontSize: 20,
    opacity: 0.5,
  },
  postContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
