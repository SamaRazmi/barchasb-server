ALTER TABLE "DigitalAd" ALTER COLUMN "minBudget" TYPE BIGINT USING 
  CASE WHEN "minBudget" ~ '^[0-9]+$' THEN "minBudget"::BIGINT ELSE NULL END;

ALTER TABLE "DigitalAd" ALTER COLUMN "maxBudget" TYPE BIGINT USING 
  CASE WHEN "maxBudget" ~ '^[0-9]+$' THEN "maxBudget"::BIGINT ELSE NULL END;

ALTER TABLE "EmployerAd" ALTER COLUMN "minSalary" TYPE BIGINT USING 
  CASE WHEN "minSalary" ~ '^[0-9]+$' THEN "minSalary"::BIGINT ELSE NULL END;

ALTER TABLE "EmployerAd" ALTER COLUMN "maxSalary" TYPE BIGINT USING 
  CASE WHEN "maxSalary" ~ '^[0-9]+$' THEN "maxSalary"::BIGINT ELSE NULL END;

ALTER TABLE "JobSeekerAd" ALTER COLUMN "suggestedSalaryIRT" TYPE BIGINT USING 
  CASE WHEN "suggestedSalaryIRT" ~ '^[0-9]+$' THEN "suggestedSalaryIRT"::BIGINT ELSE NULL END;

ALTER TABLE "SellerAd" ALTER COLUMN "priceIRT" TYPE BIGINT USING 
  CASE WHEN "priceIRT" ~ '^[0-9]+$' THEN "priceIRT"::BIGINT ELSE NULL END;