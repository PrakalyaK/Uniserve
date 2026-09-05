import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useUser } from '../context/UserContext';
import languagesData from '../data/languages.json';

export const LanguageSelectorModal = ({ visible, onClose, onSelectLanguage, currentLanguage }) => {
  const { t } = useUser();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLanguages = languagesData.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.nativeName.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q)
    );
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.header}>
            <View style={styles.headerTextCol}>
              <Text style={styles.headerTitle}>{t('selectLanguageTitle')}</Text>
              <Text style={styles.headerSubtitle}>{t('selectLanguageSub')}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color={colors.primary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search (e.g. Hindi, Tamil, తెలుగు, বাংলা)..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Language List */}
          <FlatList
            data={filteredLanguages}
            keyExtractor={(item) => item.code}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isSelected = currentLanguage?.code === item.code;
              return (
                <TouchableOpacity
                  style={[styles.languageItem, isSelected && styles.languageItemSelected]}
                  onPress={() => {
                    onSelectLanguage(item);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.languageInfo}>
                    <View style={styles.nameRow}>
                      <Text style={[styles.languageName, isSelected && styles.languageNameSelected]}>
                        {item.name}
                      </Text>
                      {item.isPrimary && (
                        <View style={styles.primaryBadge}>
                          <Text style={styles.primaryBadgeText}>Default</Text>
                        </View>
                      )}
                      {item.isPopular && !item.isPrimary && (
                        <View style={styles.popularBadge}>
                          <Text style={styles.popularBadgeText}>Popular</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.nativeName, isSelected && styles.nativeNameSelected]}>
                      {item.nativeName}
                    </Text>
                  </View>

                  <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end'
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 24
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10
  },
  headerTextCol: {
    flex: 1,
    marginRight: 10
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
    lineHeight: 16
  },
  closeButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  searchIcon: {
    marginRight: 10
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    height: '100%'
  },
  clearBtn: {
    padding: 4
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 20
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: colors.surface,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  languageItemSelected: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.primarySubtle
  },
  languageInfo: {
    flex: 1
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  languageName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary
  },
  languageNameSelected: {
    color: colors.primary,
    fontWeight: '800'
  },
  nativeName: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2
  },
  nativeNameSelected: {
    color: colors.primaryLight,
    fontWeight: '600'
  },
  primaryBadge: {
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8
  },
  primaryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary
  },
  popularBadge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.successDark
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12
  },
  radioCircleSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surface
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary
  }
});

export default LanguageSelectorModal;
