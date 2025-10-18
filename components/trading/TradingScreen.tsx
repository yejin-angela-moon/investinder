import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useBlockchain } from '../../hooks/useBlockchain';

interface TradingScreenProps {
  onBack: () => void;
}

export const TradingScreen: React.FC<TradingScreenProps> = ({ onBack }) => {
  const { tokens, orders, createTradingOrder, cancelOrder, refreshData } = useBlockchain();
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [tokenAmount, setTokenAmount] = useState('');
  const [pricePerToken, setPricePerToken] = useState('');

  const handleCreateOrder = async () => {
    if (!selectedToken || !tokenAmount || !pricePerToken) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const success = await createTradingOrder(selectedToken, orderType, tokenAmount, pricePerToken);
    if (success) {
      Alert.alert('Success', 'Order created successfully!');
      setTokenAmount('');
      setPricePerToken('');
      await refreshData();
    } else {
      Alert.alert('Error', 'Failed to create order');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    const success = await cancelOrder(orderId);
    if (success) {
      Alert.alert('Success', 'Order cancelled successfully!');
      await refreshData();
    } else {
      Alert.alert('Error', 'Failed to cancel order');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Trading</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Create Order Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Create Order</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Token</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {tokens.map((token) => (
                <TouchableOpacity
                  key={token.id}
                  style={[
                    styles.tokenButton,
                    selectedToken === token.id && styles.selectedTokenButton
                  ]}
                  onPress={() => setSelectedToken(token.id)}
                >
                  <Text style={[
                    styles.tokenButtonText,
                    selectedToken === token.id && styles.selectedTokenButtonText
                  ]}>
                    {token.symbol}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Order Type</Text>
            <View style={styles.orderTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.orderTypeButton,
                  orderType === 'buy' && styles.selectedOrderTypeButton
                ]}
                onPress={() => setOrderType('buy')}
              >
                <Text style={[
                  styles.orderTypeButtonText,
                  orderType === 'buy' && styles.selectedOrderTypeButtonText
                ]}>
                  Buy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.orderTypeButton,
                  orderType === 'sell' && styles.selectedOrderTypeButton
                ]}
                onPress={() => setOrderType('sell')}
              >
                <Text style={[
                  styles.orderTypeButtonText,
                  orderType === 'sell' && styles.selectedOrderTypeButtonText
                ]}>
                  Sell
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Token Amount</Text>
            <TextInput
              style={styles.input}
              value={tokenAmount}
              onChangeText={setTokenAmount}
              placeholder="Enter token amount"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price Per Token (USDC)</Text>
            <TextInput
              style={styles.input}
              value={pricePerToken}
              onChangeText={setPricePerToken}
              placeholder="Enter price per token"
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity style={styles.createOrderButton} onPress={handleCreateOrder}>
            <Text style={styles.createOrderButtonText}>Create Order</Text>
          </TouchableOpacity>
        </View>

        {/* Active Orders Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Orders</Text>
          {orders.length === 0 ? (
            <Text style={styles.noOrdersText}>No active orders</Text>
          ) : (
            orders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderToken}>
                    {tokens.find(t => t.id === order.tokenId)?.symbol || 'Unknown'}
                  </Text>
                  <Text style={[
                    styles.orderType,
                    order.orderType === 'buy' ? styles.buyOrder : styles.sellOrder
                  ]}>
                    {order.orderType.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.orderDetails}>
                  <Text style={styles.orderDetail}>
                    Amount: {order.tokenAmount} tokens
                  </Text>
                  <Text style={styles.orderDetail}>
                    Price: {order.pricePerToken} USDC
                  </Text>
                  <Text style={styles.orderDetail}>
                    Total: {order.totalValue} USDC
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancelOrder(order.id)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  tokenButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  selectedTokenButton: {
    backgroundColor: '#3b82f6',
  },
  tokenButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  selectedTokenButtonText: {
    color: '#ffffff',
  },
  orderTypeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  orderTypeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  selectedOrderTypeButton: {
    backgroundColor: '#3b82f6',
  },
  orderTypeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  selectedOrderTypeButtonText: {
    color: '#ffffff',
  },
  createOrderButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  createOrderButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  noOrdersText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
    fontStyle: 'italic',
  },
  orderCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderToken: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  orderType: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  buyOrder: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  sellOrder: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
  },
  orderDetails: {
    marginBottom: 12,
  },
  orderDetail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  cancelButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
