import bcrypt from "bcrypt";

import { AppDataSource } from "../data-source.js";
import { CategoryType } from "../../modules/category/entities/category.entity.js";
import { CategoryRepository } from "../../modules/category/repositories/category.repository.js";
import { UserRepository } from "../../modules/users/repositories/user.repository.js";

const SEED_PASSWORD = "Seed@123";
const SEED_USER_EMAIL = "seed@aura-finance.local";

const categoryFixtures = [
  // incoming
  { name: "Salário", icon: "TrendingUp", color: "#ff006e", type: CategoryType.INCOMING },
  { name: "Reembolso", icon: "ArrowUpRight", color: "#ffbe0b", type: CategoryType.INCOMING },
  { name: "Aluguel", icon: "Building", color: "#fb5607", type: CategoryType.INCOMING },
  { name: "Freelancer", icon: "Laptop", color: "#8338ec", type: CategoryType.INCOMING },
  { name: "Dividendos", icon: "BarChart2", color: "#3a86ff", type: CategoryType.INCOMING },
  { name: "Outros Ganhos", icon: "Sparkles", color: "#06d6a0", type: CategoryType.INCOMING },
  // outgoing
  { name: "Moradia", icon: "Home", color: "#ff7f11", type: CategoryType.OUTCOMING },
  { name: "Supermercado", icon: "ShoppingBag", color: "#ff4d6d", type: CategoryType.OUTCOMING },
  { name: "Transporte", icon: "Bus", color: "#9d4edd", type: CategoryType.OUTCOMING },
  { name: "Combustível", icon: "Zap", color: "#ff4b5c", type: CategoryType.OUTCOMING },
  { name: "Educação", icon: "BookOpen", color: "#1a759f", type: CategoryType.OUTCOMING },
  { name: "Saúde", icon: "ShieldCheck", color: "#2ab7ca", type: CategoryType.OUTCOMING },
  { name: "Lazer", icon: "Film", color: "#3f37c9", type: CategoryType.OUTCOMING },
  { name: "Restaurantes", icon: "Utensils", color: "#ff8f00", type: CategoryType.OUTCOMING },
  { name: "Assinaturas", icon: "Repeat", color: "#c77dff", type: CategoryType.OUTCOMING },
  { name: "Viagem", icon: "Plane", color: "#118ab2", type: CategoryType.OUTCOMING },
  { name: "Pets", icon: "Paw", color: "#ffd166", type: CategoryType.OUTCOMING },
  { name: "Doações", icon: "Heart", color: "#ff477e", type: CategoryType.OUTCOMING },
  { name: "Seguros", icon: "Shield", color: "#1d3557", type: CategoryType.OUTCOMING },
  { name: "Serviços", icon: "Tool", color: "#006d77", type: CategoryType.OUTCOMING },
  { name: "Telefone & Internet", icon: "Wifi", color: "#2a9d8f", type: CategoryType.OUTCOMING },
  { name: "Roupas", icon: "TShirt", color: "#ff9f1c", type: CategoryType.OUTCOMING },
  { name: "Cuidados Pessoais", icon: "Droplets", color: "#d62828", type: CategoryType.OUTCOMING },
  { name: "Impostos", icon: "FileText", color: "#0b3d91", type: CategoryType.OUTCOMING },
  { name: "Financiamentos", icon: "Banknote", color: "#c1121f", type: CategoryType.OUTCOMING },
  { name: "Outros Gastos", icon: "Circle", color: "#ffb703", type: CategoryType.OUTCOMING },
];

const run = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepository = new UserRepository();
    const categoryRepository = new CategoryRepository();

    const existingUser = await userRepository.findByEmail(SEED_USER_EMAIL);

    if (!existingUser) {
      const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);
      await userRepository.create({
        name: "Seed User",
        email: SEED_USER_EMAIL,
        passwordHash,
      });
      console.log("Seed user created", SEED_USER_EMAIL);
    } else {
      console.log("Seed user already exists");
    }

    const existingCategories = await categoryRepository.findAll();
    const existingNames = new Set(existingCategories.map((category) => category.name));
    const missingCategories = categoryFixtures.filter((fixture) => !existingNames.has(fixture.name));

    for (const category of missingCategories) {
      await categoryRepository.create(category);
      console.log("Seed category created", category.name);
    }

    if (missingCategories.length === 0) {
      console.log("All seed categories already exist");
    }
  } catch (error) {
    console.error("Failed to run seeds", error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
};

void run();
