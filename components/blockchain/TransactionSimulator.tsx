import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TransactionSimulatorProps {
  visible: boolean;
  onClose: () => void;
  transactionType: 'investment' | 'trading' | 'dividend';
  amount: string;
  tokenSymbol: string;
  companyName: string;
}

export function TransactionSimulator({
  visible,
  onClose,
  transactionType,
  amount,
  tokenSymbol,
  companyName,
}: TransactionSimulatorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [blockNumber, setBlockNumber] = useState(0);
  const [gasUsed, setGasUsed] = useState(0);
  const [transactionHash, setTransactionHash] = useState('');
  const [validatorInfo, setValidatorInfo] = useState({
    name: 'Validator Node #2471',
    stake: '32.5 ETH',
    reputation: '99.2%',
  });

  const steps = [
    'Transaction Created',
    'Validating Inputs',
    'PoS Consensus',
    'Block Proposal',
    'Network Confirmation',
    'Transaction Complete',
  ];

  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      startSimulation();
    } else {
      resetSimulation();
    }
  }, [visible]);

  const startSimulation = () => {
    setCurrentStep(0);
    setProgress(0);
    setBlockNumber(0);
    setGasUsed(0);
    setTransactionHash('');
    
    // Generate random transaction hash
    const hash = '0x' + Math.random().toString(16).substr(2, 64);
    setTransactionHash(hash);

    // Simulate transaction steps
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = prev + 1;
        if (nextStep < steps.length) {
          setProgress((nextStep / steps.length) * 100);
          setBlockNumber(nextStep * 2 + 18500000);
          setGasUsed(nextStep * 15000 + 21000);
          return nextStep;
        } else {
          // Final step - ensure 100% completion
          setProgress(100);
          setBlockNumber(18500010);
          setGasUsed(81000);
          clearInterval(stepInterval);
          return prev;
        }
      });
    }, 1500);

    // Animate progress bar
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: steps.length * 1500,
      useNativeDriver: false,
    }).start();
  };

  const resetSimulation = () => {
    setCurrentStep(0);
    setProgress(0);
    setBlockNumber(0);
    setGasUsed(0);
    setTransactionHash('');
    animatedValue.setValue(0);
  };

  const getStepIcon = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'checkmark-circle';
    if (stepIndex === currentStep) return 'time';
    return 'ellipse-outline';
  };

  const getStepColor = (stepIndex: number) => {
    if (stepIndex < currentStep) return '#10B981';
    if (stepIndex === currentStep) return '#F59E0B';
    return '#9CA3AF';
  };

  const getTransactionDetails = () => {
    switch (transactionType) {
      case 'investment':
        return {
          title: 'Investment Transaction',
          description: `Investing ${amount} USDC for ${tokenSymbol} tokens`,
          icon: 'trending-up',
          color: '#3B82F6',
        };
      case 'trading':
        return {
          title: 'Trading Transaction',
          description: `Trading ${amount} ${tokenSymbol} tokens`,
          icon: 'swap-horizontal',
          color: '#10B981',
        };
      case 'dividend':
        return {
          title: 'Dividend Claim',
          description: `Claiming ${amount} USDC dividends`,
          icon: 'cash',
          color: '#8B5CF6',
        };
      default:
        return {
          title: 'Blockchain Transaction',
          description: 'Processing transaction...',
          icon: 'link',
          color: '#6B7280',
        };
    }
  };

  const transactionDetails = getTransactionDetails();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons 
                name={transactionDetails.icon} 
                size={24} 
                color={transactionDetails.color} 
              />
              <Text style={styles.headerTitle}>{transactionDetails.title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Transaction Info */}
          <View style={styles.transactionInfo}>
            <Text style={styles.companyName}>{companyName}</Text>
            <Text style={styles.transactionDescription}>
              {transactionDetails.description}
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(progress)}% Complete
            </Text>
          </View>

          {/* Steps */}
          <View style={styles.stepsContainer}>
            {steps.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <Ionicons
                  name={getStepIcon(index)}
                  size={20}
                  color={getStepColor(index)}
                />
                <Text
                  style={[
                    styles.stepText,
                    { color: getStepColor(index) },
                  ]}
                >
                  {step}
                </Text>
              </View>
            ))}
          </View>

          {/* Blockchain Details */}
          <View style={styles.blockchainDetails}>
            <Text style={styles.detailsTitle}>Blockchain Details</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction Hash:</Text>
              <Text style={styles.detailValue}>
                {transactionHash ? `${transactionHash.slice(0, 10)}...${transactionHash.slice(-8)}` : 'Generating...'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Block Number:</Text>
              <Text style={styles.detailValue}>{blockNumber.toLocaleString()}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Gas Used:</Text>
              <Text style={styles.detailValue}>{gasUsed.toLocaleString()} gas</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Validator:</Text>
              <Text style={styles.detailValue}>{validatorInfo.name}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Stake:</Text>
              <Text style={styles.detailValue}>{validatorInfo.stake}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reputation:</Text>
              <Text style={styles.detailValue}>{validatorInfo.reputation}</Text>
            </View>
          </View>


          {/* Action Button */}
          {progress >= 100 && (
            <TouchableOpacity style={styles.completeButton} onPress={onClose}>
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={styles.completeButtonText}>Transaction Complete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  transactionInfo: {
    marginBottom: 24,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressSection: {
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  stepsContainer: {
    marginBottom: 24,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '500',
  },
  blockchainDetails: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  detailValue: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  completeButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
