import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBlockchain } from '../../hooks/useBlockchain';
import { TransactionSimulator } from '../blockchain/TransactionSimulator';

interface InvestmentScreenProps {
  onBack: () => void;
}

export function InvestmentScreen({ onBack }: InvestmentScreenProps) {
  const { isConnected, tokens, investInStartup, connectWallet } = useBlockchain();
  const [selectedStartup, setSelectedStartup] = useState<string>('');
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [isInvesting, setIsInvesting] = useState<boolean>(false);
  const [showTransactionSimulator, setShowTransactionSimulator] = useState(false);

  const handleInvestment = async () => {
    if (!selectedStartup || !investmentAmount) {
      Alert.alert('Missing Information', 'Please select a startup and enter investment amount');
      return;
    }

    const startup = tokens.find(token => token.id === selectedStartup);
    if (!startup) {
      Alert.alert('Error', 'Startup not found');
      return;
    }

    const tokenAmount = (parseFloat(investmentAmount) / parseFloat(startup.pricePerToken)).toString();
    
    setIsInvesting(true);
    setShowTransactionSimulator(true);
    
    try {
      const success = await investInStartup(selectedStartup, tokenAmount, investmentAmount);
      if (success) {
        // Transaction simulator will handle the success message
      }
    } catch (error) {
      console.error('Investment error:', error);
      setShowTransactionSimulator(false);
      Alert.alert('Error', 'Investment failed. Please try again.');
    } finally {
      setIsInvesting(false);
    }
  };

  const handleConnectWallet = async () => {
    const success = await connectWallet();
    if (!success) {
      Alert.alert('Connection Failed', 'Please try again');
    }
  };

  const selectedStartupData = tokens.find(token => token.id === selectedStartup);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invest in Startups</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Wallet Connection */}
        {!isConnected ? (
          <View style={styles.walletSection}>
            <View style={styles.walletCard}>
              <Ionicons name="wallet-outline" size={48} color="#3B82F6" />
              <Text style={styles.walletTitle}>Connect Your Wallet</Text>
              <Text style={styles.walletDescription}>
                Connect MetaMask to start investing in startup equity tokens
              </Text>
              <TouchableOpacity style={styles.connectButton} onPress={handleConnectWallet}>
                <Text style={styles.connectButtonText}>Connect MetaMask</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {/* Investment Form */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Make an Investment</Text>
              
              {/* Startup Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Select Startup</Text>
                <View style={styles.startupList}>
                  {tokens.map((startup) => (
                    <TouchableOpacity
                      key={startup.id}
                      style={[
                        styles.startupCard,
                        selectedStartup === startup.id && styles.selectedStartupCard
                      ]}
                      onPress={() => setSelectedStartup(startup.id)}
                    >
                      <View style={styles.startupInfo}>
                        <Text style={styles.startupName}>{startup.name}</Text>
                        <Text style={styles.startupSymbol}>{startup.symbol}</Text>
                        <Text style={styles.startupPrice}>
                          ${startup.pricePerToken} per token
                        </Text>
                      </View>
                      {selectedStartup === startup.id && (
                        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Investment Amount */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Investment Amount (USDC)</Text>
                <TextInput
                  style={styles.amountInput}
                  value={investmentAmount}
                  onChangeText={setInvestmentAmount}
                  placeholder="Enter amount in USDC"
                  keyboardType="numeric"
                />
                {selectedStartup && investmentAmount && (
                  <View style={styles.calculationCard}>
                    <Text style={styles.calculationText}>
                      You will receive: {(
                        parseFloat(investmentAmount) / 
                        parseFloat(tokens.find(t => t.id === selectedStartup)?.pricePerToken || '1')
                      ).toFixed(2)} tokens
                    </Text>
                  </View>
                )}
              </View>

              {/* Invest Button */}
              <TouchableOpacity
                style={[
                  styles.investButton, 
                  isInvesting && styles.investButtonDisabled
                ]}
                onPress={handleInvestment}
                disabled={isInvesting || !selectedStartup || !investmentAmount}
              >
                <Text style={styles.investButtonText}>
                  {isInvesting ? 'Processing...' : 
                   !selectedStartup ? 'Select Startup' :
                   !investmentAmount ? 'Enter Amount' : 'Invest Now'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Available Startups */}
            <View style={styles.startupsSection}>
              <Text style={styles.sectionTitle}>Available Startups</Text>
              {tokens.map((startup) => (
                <View key={startup.id} style={styles.startupCard}>
                  <View style={styles.startupHeader}>
                    <Text style={styles.startupName}>{startup.name}</Text>
                    <Text style={styles.startupSymbol}>{startup.symbol}</Text>
                  </View>
                  <View style={styles.startupDetails}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Price per Token</Text>
                      <Text style={styles.detailValue}>${startup.pricePerToken}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Total Supply</Text>
                      <Text style={styles.detailValue}>{startup.totalSupply}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Contract</Text>
                      <Text style={styles.detailValue}>
                        {startup.contractAddress.slice(0, 6)}...{startup.contractAddress.slice(-4)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
        </ScrollView>
        
        {/* Transaction Simulator */}
        <TransactionSimulator
          visible={showTransactionSimulator}
          onClose={() => {
            setShowTransactionSimulator(false);
            setInvestmentAmount('');
            setSelectedStartup('');
          }}
          transactionType="investment"
          amount={investmentAmount}
          tokenSymbol={selectedStartupData?.symbol || ''}
          companyName={selectedStartupData?.name || ''}
        />
      </SafeAreaView>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3B82F6',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  walletSection: {
    padding: 24,
  },
  walletCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  walletTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  walletDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  connectButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  formSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  startupList: {
    gap: 12,
  },
  startupCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedStartupCard: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF4FF',
  },
  startupInfo: {
    flex: 1,
  },
  startupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  startupSymbol: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  startupPrice: {
    fontSize: 14,
    color: '#10B981',
    marginTop: 4,
  },
  amountInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  calculationCard: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  calculationText: {
    fontSize: 14,
    color: '#166534',
    fontWeight: '500',
  },
  investButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  investButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  investButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  startupsSection: {
    padding: 24,
    paddingTop: 0,
  },
  startupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  startupDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
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
    flex: 1,
    textAlign: 'right',
  },
});
