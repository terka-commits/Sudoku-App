import { getRewardAsset } from '../assets/mysteryAssets';
import { Reward } from '../types/chapter';
import { EvidenceItemCard } from './EvidenceItemCard';

type EvidenceSlotProps = {
  reward: Reward;
  index: number;
  found: boolean;
};

export function EvidenceSlot({ reward, index, found }: EvidenceSlotProps) {
  const source = getRewardAsset(reward.id);
  return <EvidenceItemCard source={source} title={reward.title} index={index} found={found} compact />;
}
