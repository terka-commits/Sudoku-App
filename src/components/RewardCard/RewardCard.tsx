import { StyleSheet, Text, View } from 'react-native';
import { getRewardAsset } from '../../assets/mysteryAssets';
import { mysteryColors, mysterySpacing, mysteryTypography } from '../../theme';
import { Reward } from '../../types/chapter';
import { EvidenceItemCard } from '../EvidenceItemCard';

type RewardCardProps = {
  reward: Reward;
  found: boolean;
};

export function RewardCard({ reward, found }: RewardCardProps) {
  const source = getRewardAsset(reward.id);

  return (
    <View style={[styles.card, !found && styles.missing]}>
      <EvidenceItemCard source={source} title={reward.title} found={found} compact />
      <View style={styles.copy}>
        <Text style={styles.title}>{reward.title}</Text>
        <Text style={styles.description}>{reward.description}</Text>
        <Text style={[styles.status, found ? styles.found : styles.notFound]}>{found ? 'Nalezeno' : 'Neodhaleno'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: 'rgba(7, 16, 20, 0.74)',
    borderWidth: 1,
    borderColor: 'rgba(201, 167, 92, 0.28)',
    padding: mysterySpacing.md,
    flexDirection: 'row',
    gap: mysterySpacing.md,
    alignItems: 'center',
  },
  missing: {
    opacity: 0.72,
  },
  copy: {
    flex: 1,
  },
  title: {
    color: mysteryColors.cream,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.h3,
    fontWeight: '800',
  },
  description: {
    color: mysteryColors.muted,
    marginTop: mysterySpacing.sm,
    lineHeight: 20,
  },
  status: {
    marginTop: mysterySpacing.md,
    fontWeight: '800',
  },
  found: {
    color: mysteryColors.success,
  },
  notFound: {
    color: mysteryColors.muted,
  },
});
