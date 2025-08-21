import { useRouter } from 'vue-router';

export function useNavigation() {
  const router = useRouter();

  const goHome = () => {
    router.push({ name: 'HomeView' });
  };

  return {
    goHome,
  };
}
